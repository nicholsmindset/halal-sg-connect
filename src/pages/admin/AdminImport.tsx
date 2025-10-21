import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BulkImportUpload from '@/components/admin/BulkImportUpload';
import AdminLayout from '@/components/AdminLayout';
import {
  Upload,
  History,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { ImportJob, ImportStatistics } from '@/types/import';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOPageGenerator } from '@/lib/seo-generator';
import { useToast } from '@/hooks/use-toast';

export default function AdminImport() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch import jobs
  const {
    data: importJobs,
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['import-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('import_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ImportJob[];
    },
  });

  // Fetch import statistics
  const { data: importStats } = useQuery({
    queryKey: ['import-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('import_statistics')
        .select('*')
        .limit(30);

      if (error) throw error;
      return data as ImportStatistics[];
    },
  });

  const handleImportStart = (jobId: string) => {
    setActiveJobId(jobId);
    toast({
      title: 'Import started',
      description: 'Your bulk import has been queued for processing.',
    });
  };

  const handleImportComplete = () => {
    setActiveJobId(null);
    refetchJobs();
    toast({
      title: 'Import completed',
      description: 'Your businesses have been successfully imported.',
    });
  };

  const generateSEOPages = async () => {
    try {
      toast({
        title: 'Generating SEO pages',
        description: 'This may take a few minutes...',
      });

      await SEOPageGenerator.generateAllPages();

      toast({
        title: 'SEO pages generated',
        description:
          'All programmatic SEO pages have been created successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'SEO generation failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: ImportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: ImportJob['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bulk Import</h1>
            <p className="text-muted-foreground">
              Import businesses in bulk and manage SEO page generation
            </p>
          </div>
          <Button onClick={generateSEOPages} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate SEO Pages
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Import History
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <Settings className="mr-2 h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <BulkImportUpload
              onImportStart={handleImportStart}
              onImportComplete={handleImportComplete}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Import Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : importJobs && importJobs.length > 0 ? (
                  <div className="space-y-4">
                    {importJobs.map(job => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(job.status)}
                          <div>
                            <h3 className="font-medium">{job.filename}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(job.created_at).toLocaleDateString()} •{' '}
                              {job.total_records} records
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex space-x-2">
                              <Badge className="bg-green-100 text-green-800">
                                {job.successful_imports} success
                              </Badge>
                              {job.failed_imports > 0 && (
                                <Badge className="bg-red-100 text-red-800">
                                  {job.failed_imports} failed
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">
                      No import jobs yet
                    </h3>
                    <p className="text-muted-foreground">
                      Start by uploading your first CSV file in the Upload tab.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {importJobs?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Import Jobs
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {importJobs?.reduce(
                      (sum, job) => sum + job.successful_imports,
                      0
                    ) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Businesses Imported
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {importJobs?.reduce(
                      (sum, job) => sum + job.failed_imports,
                      0
                    ) || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Failed Imports
                  </p>
                </CardContent>
              </Card>
            </div>

            {importStats && importStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Statistics (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {importStats.slice(0, 10).map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">
                            {new Date(stat.import_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.total_jobs} jobs •{' '}
                            {Math.round(stat.avg_duration_minutes)}min avg
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            {stat.total_successful} success
                          </div>
                          <div className="text-sm text-red-600">
                            {stat.total_failed} failed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
