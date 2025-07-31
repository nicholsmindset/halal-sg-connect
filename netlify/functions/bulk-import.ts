import { Handler } from '@netlify/functions';
import { supabase } from '../../src/integrations/supabase/client';
import { CSVImportParser, ImportValidator, GeocodingService, DuplicateDetector } from '../../src/lib/import-utils';
import { BusinessImportData, ImportJob } from '../../src/types/import';
import multiparty from 'multiparty';

// Netlify Function for Bulk Business Import
export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse multipart form data
    const form = new multiparty.Form();
    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(event.body, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file?.[0];
    const mapping = JSON.parse(fields.mapping?.[0] || '{}');
    const options = JSON.parse(fields.options?.[0] || '{}');

    if (!file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    // Create import job record
    const { data: importJob, error: jobError } = await supabase
      .from('import_jobs')
      .insert({
        filename: file.originalFilename || 'unknown.csv',
        file_size: file.size,
        file_type: 'csv',
        import_type: 'csv',
        status: 'pending',
        imported_by: context.user?.id // Assume user context is available
      })
      .select()
      .single();

    if (jobError || !importJob) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create import job' })
      };
    }

    // Process the import asynchronously
    processImportAsync(importJob.id, file, mapping, options);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        jobId: importJob.id,
        status: 'processing',
        message: 'Import started successfully'
      })
    };

  } catch (error: any) {
    console.error('Bulk import error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};

// Async function to process the import
async function processImportAsync(
  jobId: string, 
  file: any, 
  mapping: Record<string, string>, 
  options: any
) {
  try {
    // Update job status to processing
    await supabase
      .from('import_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Parse CSV file
    const fileContent = file.toString('utf8');
    const blob = new Blob([fileContent], { type: 'text/csv' });
    const csvFile = new File([blob], file.originalFilename || 'import.csv', { type: 'text/csv' });
    
    const { data: csvData } = await CSVImportParser.parseCSV(csvFile);

    // Update total records count
    await supabase
      .from('import_jobs')
      .update({ total_records: csvData.length })
      .eq('id', jobId);

    let processedRecords = 0;
    let successfulImports = 0;
    let failedImports = 0;
    const errorLog: string[] = [];

    // Get existing businesses for duplicate detection
    const { data: existingBusinesses } = await supabase
      .from('businesses')
      .select('*');

    // Process records in batches
    const batchSize = options.batch_size || 100;
    
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      
      for (const [index, row] of batch.entries()) {
        const rowNumber = i + index + 1;
        
        try {
          // Transform and validate data
          const transformedData = CSVImportParser.transformCSVRow(row, mapping);
          const validation = ImportValidator.validateBusinessData(transformedData, rowNumber);
          
          if (!validation.valid) {
            failedImports++;
            errorLog.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
            continue;
          }

          const businessData = validation.data!;

          // Check for duplicates if enabled
          if (options.skip_duplicates && existingBusinesses) {
            const duplicates = await DuplicateDetector.findPotentialDuplicates(
              businessData,
              existingBusinesses
            );
            
            if (duplicates.length > 0 && duplicates[0].similarity > 0.8) {
              failedImports++;
              errorLog.push(`Row ${rowNumber}: Potential duplicate of "${duplicates[0].business.name}"`);
              continue;
            }
          }

          // Geocode address if enabled
          let coordinates = businessData.coordinates;
          let district = businessData.district;
          
          if (options.auto_geocode && !coordinates && businessData.address) {
            const geocodeResult = await GeocodingService.geocodeAddress(businessData.address);
            if (geocodeResult.success) {
              coordinates = geocodeResult.coordinates;
              district = geocodeResult.district || district;
            }
          }

          // Generate business slug
          const slug = generateBusinessSlug(businessData.name);
          
          // Prepare business insert data
          const businessInsert = {
            name: businessData.name,
            slug,
            description: businessData.description,
            category: businessData.category, // Will need to map to category ID
            subcategory: businessData.subcategory,
            address: businessData.address,
            postal_code: businessData.postal_code,
            district,
            phone: businessData.phone,
            email: businessData.email,
            website: businessData.website,
            halal_certified: businessData.halal_certified,
            certification_body: businessData.certification_body,
            certification_number: businessData.certification_number,
            price_range: businessData.price_range,
            price_level: businessData.price_level,
            features: businessData.features,
            tags: businessData.tags,
            cuisine_types: businessData.cuisine_types,
            amenities: businessData.amenities,
            special_diets: businessData.special_diets,
            payment_methods: businessData.payment_methods,
            delivery_platforms: businessData.delivery_platforms,
            rating: businessData.rating || 0,
            review_count: businessData.review_count || 0,
            coordinates: coordinates ? `POINT(${coordinates.lng} ${coordinates.lat})` : null,
            business_hours: businessData.opening_hours,
            verification_status: 'pending',
            import_source: businessData.source,
            import_job_id: jobId,
            facebook_id: businessData.facebook_id,
            instagram_handle: businessData.instagram_handle,
            google_place_id: businessData.google_place_id,
            views: 0,
            clicks: 0,
            is_premium: false,
            subscription_tier: 'free',
            last_updated: new Date().toISOString()
          };

          // Skip actual insert if validation only
          if (options.validate_only) {
            successfulImports++;
          } else {
            // Insert business
            const { error: insertError } = await supabase
              .from('businesses')
              .insert(businessInsert);

            if (insertError) {
              failedImports++;
              errorLog.push(`Row ${rowNumber}: Database insert failed - ${insertError.message}`);
            } else {
              successfulImports++;
            }
          }

        } catch (error: any) {
          failedImports++;
          errorLog.push(`Row ${rowNumber}: Processing error - ${error.message}`);
        }

        processedRecords++;

        // Update progress every 10 records
        if (processedRecords % 10 === 0) {
          await supabase
            .from('import_jobs')
            .update({
              processed_records: processedRecords,
              successful_imports: successfulImports,
              failed_imports: failedImports,
              error_log: errorLog
            })
            .eq('id', jobId);
        }
      }
    }

    // Final update
    await supabase
      .from('import_jobs')
      .update({
        status: 'completed',
        processed_records: processedRecords,
        successful_imports: successfulImports,
        failed_imports: failedImports,
        error_log: errorLog,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`Import job ${jobId} completed: ${successfulImports} successful, ${failedImports} failed`);

  } catch (error: any) {
    console.error(`Import job ${jobId} failed:`, error);
    
    await supabase
      .from('import_jobs')
      .update({
        status: 'failed',
        error_log: [error.message],
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}

// Helper function to generate business slug
function generateBusinessSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50); // Limit length
}