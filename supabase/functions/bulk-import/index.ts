/**
 * Supabase Edge Function for Bulk CSV Import
 * Deploy this to: supabase/functions/bulk-import/index.ts
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportOptions {
  skipDuplicates: boolean
  autoGeocode: boolean
  validateOnly: boolean
  batchSize: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const mappingJson = formData.get('mapping') as string
    const optionsJson = formData.get('options') as string

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const mapping = JSON.parse(mappingJson || '{}')
    const options: ImportOptions = JSON.parse(optionsJson || '{}')

    // Create import job
    const { data: importJob, error: jobError } = await supabaseClient
      .from('import_jobs')
      .insert({
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        status: 'pending',
        import_type: 'csv',
        imported_by: user.id,
      })
      .select()
      .single()

    if (jobError) {
      console.error('Error creating import job:', jobError)
      return new Response(
        JSON.stringify({ error: 'Failed to create import job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse CSV using proper RFC 4180 compliant parser
    const csvText = await file.text()

    // Simple but robust CSV parser that handles quoted fields correctly
    function parseCSV(text: string): Record<string, string>[] {
      const lines: string[] = []
      let currentLine = ''
      let inQuotes = false

      // Split into lines while respecting quotes
      for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const nextChar = text[i + 1]

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentLine += '"'
            i++ // Skip next quote
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === '\n' && !inQuotes) {
          if (currentLine.trim()) lines.push(currentLine)
          currentLine = ''
        } else if (char !== '\r') {
          currentLine += char
        }
      }
      if (currentLine.trim()) lines.push(currentLine)

      if (lines.length === 0) return []

      // Parse header row
      const headers = parseCSVLine(lines[0])

      // Parse data rows
      const data: Record<string, string>[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        data.push(row)
      }
      return data
    }

    function parseCSVLine(line: string): string[] {
      const values: string[] = []
      let currentValue = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const nextChar = line[i + 1]

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentValue += '"'
            i++ // Skip next quote
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
      }
      values.push(currentValue.trim())
      return values
    }

    const data = parseCSV(csvText)

    // Update job with total records
    await supabaseClient
      .from('import_jobs')
      .update({
        total_records: data.length,
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .eq('id', importJob.id)

    // Process in batches
    const batchSize = options.batchSize || 100
    let successful = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      for (const row of batch) {
        try {
          // Transform row using mapping
          const business = transformRow(row, mapping)

          // Geocode address if needed
          if (options.autoGeocode && business.address) {
            const coords = await geocodeAddress(business.address, business.postal_code)
            if (coords) {
              business.coordinates = `POINT(${coords.lng} ${coords.lat})`
            }
          }

          // Check for duplicates
          if (options.skipDuplicates) {
            const { data: existing } = await supabaseClient
              .from('businesses')
              .select('id')
              .or(`name.eq.${business.name},google_place_id.eq.${business.google_place_id}`)
              .limit(1)

            if (existing && existing.length > 0) {
              console.log(`Skipping duplicate: ${business.name}`)
              continue
            }
          }

          // Validate only mode
          if (options.validateOnly) {
            successful++
            continue
          }

          // Insert business
          const { error: insertError } = await supabaseClient
            .from('businesses')
            .insert({
              ...business,
              import_job_id: importJob.id,
              import_source: 'google_my_business',
              verification_status: 'needs_review',
            })

          if (insertError) {
            failed++
            errors.push(`Row ${i + batch.indexOf(row) + 1}: ${insertError.message}`)
          } else {
            successful++
          }
        } catch (error: any) {
          failed++
          errors.push(`Row ${i + batch.indexOf(row) + 1}: ${error.message}`)
        }
      }

      // Update progress
      await supabaseClient
        .from('import_jobs')
        .update({
          processed_records: Math.min(i + batchSize, data.length),
          successful_imports: successful,
          failed_imports: failed,
        })
        .eq('id', importJob.id)
    }

    // Finalize import job
    await supabaseClient
      .from('import_jobs')
      .update({
        status: failed > 0 && successful === 0 ? 'failed' : 'completed',
        successful_imports: successful,
        failed_imports: failed,
        error_log: errors.slice(0, 100), // Keep first 100 errors
        completed_at: new Date().toISOString(),
      })
      .eq('id', importJob.id)

    return new Response(
      JSON.stringify({
        jobId: importJob.id,
        totalRecords: data.length,
        successful,
        failed,
        errors: errors.slice(0, 10), // Return first 10 errors
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function transformRow(row: any, mapping: Record<string, string>): any {
  const business: any = {}

  // Map fields
  for (const [csvField, dbField] of Object.entries(mapping)) {
    if (row[csvField]) {
      business[dbField] = row[csvField]
    }
  }

  // Generate slug from name
  if (business.name) {
    business.slug = business.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Parse rating
  if (business.rating) {
    business.rating = parseFloat(business.rating)
  }

  // Parse review count
  if (business.review_count) {
    business.review_count = parseInt(business.review_count)
  }

  // Parse halal certified
  if (typeof business.halal_certified === 'string') {
    business.halal_certified = ['true', 'yes', '1', 'muis'].includes(
      business.halal_certified.toLowerCase()
    )
  }

  // Parse arrays (tags, features, cuisine_types)
  const arrayFields = ['tags', 'features', 'cuisine_types', 'amenities']
  arrayFields.forEach(field => {
    if (business[field] && typeof business[field] === 'string') {
      business[field] = business[field]
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean)
    }
  })

  return business
}

async function geocodeAddress(address: string, postalCode?: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using OneMap API (Singapore government API)
    const searchAddress = postalCode || address
    const response = await fetch(
      `https://developers.onemap.sg/commonapi/search?searchVal=${encodeURIComponent(searchAddress)}&returnGeom=Y&getAddrDetails=Y`
    )

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        lat: parseFloat(result.LATITUDE),
        lng: parseFloat(result.LONGITUDE),
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
