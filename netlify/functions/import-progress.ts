import { Handler } from '@netlify/functions';
import { supabase } from '../../src/integrations/supabase/client';

// Netlify Function to get import progress
export const handler: Handler = async (event, context) => {
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

  try {
    const jobId = event.path.split('/').pop();

    if (!jobId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Job ID is required' }),
      };
    }

    // Get import job details
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

    // Calculate progress percentage
    const progressPercentage =
      importJob.total_records > 0
        ? Math.round(
            (importJob.processed_records / importJob.total_records) * 100
          )
        : 0;

    // Estimate completion time
    let estimatedCompletion = null;
    if (
      importJob.status === 'processing' &&
      importJob.started_at &&
      progressPercentage > 0
    ) {
      const startTime = new Date(importJob.started_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const estimatedTotalTime = (elapsedTime / progressPercentage) * 100;
      const remainingTime = estimatedTotalTime - elapsedTime;
      estimatedCompletion = new Date(currentTime + remainingTime).toISOString();
    }

    const progress = {
      job_id: importJob.id,
      status: importJob.status,
      progress_percentage: progressPercentage,
      current_record: importJob.processed_records,
      total_records: importJob.total_records,
      successful_imports: importJob.successful_imports,
      failed_imports: importJob.failed_imports,
      errors: importJob.error_log || [],
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
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
