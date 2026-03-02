import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Netlify Function to get import progress - requires authentication
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Authenticate request
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }

  try {
    const jobId = event.path?.split('/').pop();

    if (!jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Job ID is required' }),
      };
    }

    const { data: importJob, error } = await supabase
      .from('import_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !importJob) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Import job not found' }),
      };
    }

    const job = importJob as any;
    const progressPercentage =
      job.total_records > 0
        ? Math.round((job.processed_records / job.total_records) * 100)
        : 0;

    let estimatedCompletion = null;
    if (job.status === 'processing' && job.started_at && progressPercentage > 0) {
      const startTime = new Date(job.started_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const estimatedTotalTime = (elapsedTime / progressPercentage) * 100;
      const remainingTime = estimatedTotalTime - elapsedTime;
      estimatedCompletion = new Date(currentTime + remainingTime).toISOString();
    }

    const progress = {
      job_id: job.id,
      status: job.status,
      progress_percentage: progressPercentage,
      current_record: job.processed_records,
      total_records: job.total_records,
      successful_imports: job.successful_imports,
      failed_imports: job.failed_imports,
      errors: job.error_log || [],
      estimated_completion: estimatedCompletion,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(progress),
    };
  } catch (error: any) {
    console.error('Import progress error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
