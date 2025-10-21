import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Eye,
  Settings,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import { CSVImportParser, ImportValidator } from '@/lib/import-utils';
import {
  BusinessImportData,
  ImportValidationResult,
  ImportProgress,
} from '@/types/import';
import { useToast } from '@/hooks/use-toast';

interface BulkImportUploadProps {
  onImportStart?: (jobId: string) => void;
  onImportComplete?: (results: ImportValidationResult[]) => void;
}

export default function BulkImportUpload({
  onImportStart,
  onImportComplete,
}: BulkImportUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<
    'upload' | 'mapping' | 'validation' | 'import' | 'complete'
  >('upload');
  const [csvData, setCSVData] = useState<any[]>([]);
  const [csvHeaders, setCSVHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string>>(
    {}
  );
  const [validationResults, setValidationResults] = useState<
    ImportValidationResult[]
  >([]);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null
  );
  const [importOptions, setImportOptions] = useState({
    skip_duplicates: true,
    auto_geocode: true,
    validate_only: false,
    batch_size: 100,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(
    async (uploadedFile: File) => {
      if (!uploadedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV file',
          variant: 'destructive',
        });
        return;
      }

      try {
        setFile(uploadedFile);
        const { data, headers } = await CSVImportParser.parseCSV(uploadedFile);

        setCSVData(data);
        setCSVHeaders(headers);

        // Auto-map headers
        const autoMapping = CSVImportParser.mapCSVHeaders(headers);
        setHeaderMapping(autoMapping);

        setUploadStep('mapping');

        toast({
          title: 'File uploaded successfully',
          description: `Parsed ${data.length} records with ${headers.length} columns`,
        });
      } catch (error: any) {
        toast({
          title: 'Upload failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileUpload(droppedFile);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileUpload(selectedFile);
      }
    },
    [handleFileUpload]
  );

  const validateData = useCallback(async () => {
    if (!csvData.length) return;

    const transformedData = csvData.map(row =>
      CSVImportParser.transformCSVRow(row, headerMapping)
    );

    const results = ImportValidator.validateBatch(transformedData);
    setValidationResults(results);
    setUploadStep('validation');

    const validCount = results.filter(r => r.valid).length;
    const invalidCount = results.length - validCount;

    toast({
      title: 'Validation complete',
      description: `${validCount} valid records, ${invalidCount} invalid records`,
    });
  }, [csvData, headerMapping, toast]);

  const startImport = useCallback(async () => {
    if (!file || !validationResults.length) return;

    try {
      setUploadStep('import');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('mapping', JSON.stringify(headerMapping));
      formData.append('options', JSON.stringify(importOptions));

      const response = await fetch('/api/import/bulk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const { jobId } = await response.json();

      if (onImportStart) {
        onImportStart(jobId);
      }

      // Start polling for progress
      pollImportProgress(jobId);
    } catch (error: any) {
      toast({
        title: 'Import failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [
    file,
    headerMapping,
    importOptions,
    validationResults,
    onImportStart,
    toast,
  ]);

  const pollImportProgress = useCallback(
    async (jobId: string) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/import/progress/${jobId}`);
          const progress: ImportProgress = await response.json();

          setImportProgress(progress);

          if (progress.status === 'completed' || progress.status === 'failed') {
            clearInterval(interval);
            setUploadStep('complete');

            if (onImportComplete) {
              onImportComplete(validationResults);
            }
          }
        } catch (error) {
          console.error('Failed to fetch import progress:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    },
    [validationResults, onImportComplete]
  );

  const resetImport = () => {
    setFile(null);
    setUploadStep('upload');
    setCSVData([]);
    setCSVHeaders([]);
    setHeaderMapping({});
    setValidationResults([]);
    setImportProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'name',
      'description',
      'category',
      'subcategory',
      'address',
      'postal_code',
      'district',
      'phone',
      'email',
      'website',
      'halal_certified',
      'certification_body',
      'price_range',
      'features',
      'tags',
      'cuisine_types',
      'opening_hours',
    ];

    const csvContent =
      headers.join(',') +
      '\n' +
      'Sample Restaurant,Authentic halal cuisine,Restaurants,Chinese,123 Orchard Road,238858,Orchard,+6591234567,info@sample.com,https://sample.com,true,MUIS,$$,"dine-in,takeaway","chinese,halal","Chinese,Zi Char","""monday"":{""open"":""10:00"",""close"":""22:00""}"';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Upload Business Data</h3>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with business information to import in bulk
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Drop your CSV file here</p>
          <p className="text-sm text-muted-foreground">
            or click to select a file from your device
          </p>
          <p className="text-xs text-muted-foreground">
            Supports CSV files up to 10MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Your CSV should include columns like: name, address, category, phone,
          email, halal_certified. Download our template for the recommended
          format.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderMappingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Map CSV Columns</h3>
          <p className="text-sm text-muted-foreground">
            Map your CSV columns to our business data fields
          </p>
        </div>
        <Badge variant="secondary">{csvData.length} records found</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {csvHeaders.map(header => (
          <div key={header} className="space-y-2">
            <Label htmlFor={header}>
              {header}{' '}
              <span className="text-muted-foreground">(CSV Column)</span>
            </Label>
            <select
              id={header}
              value={headerMapping[header] || ''}
              onChange={e =>
                setHeaderMapping(prev => ({
                  ...prev,
                  [header]: e.target.value,
                }))
              }
              className="w-full rounded-md border p-2"
            >
              <option value="">-- Skip this column --</option>
              <option value="name">Business Name</option>
              <option value="description">Description</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="address">Address</option>
              <option value="postal_code">Postal Code</option>
              <option value="district">District</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="website">Website</option>
              <option value="halal_certified">Halal Certified</option>
              <option value="certification_body">Certification Body</option>
              <option value="price_range">Price Range</option>
              <option value="rating">Rating</option>
              <option value="features">Features</option>
              <option value="tags">Tags</option>
              <option value="cuisine_types">Cuisine Types</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={resetImport}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={validateData}>
          <Eye className="mr-2 h-4 w-4" />
          Preview & Validate
        </Button>
      </div>
    </div>
  );

  const renderValidationStep = () => {
    const validRecords = validationResults.filter(r => r.valid);
    const invalidRecords = validationResults.filter(r => !r.valid);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Validation Results</h3>
            <p className="text-sm text-muted-foreground">
              Review the validation results before importing
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              {validRecords.length} Valid
            </Badge>
            <Badge variant="destructive">{invalidRecords.length} Invalid</Badge>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="valid">Valid Records</TabsTrigger>
            <TabsTrigger value="invalid">Invalid Records</TabsTrigger>
            <TabsTrigger value="options">Import Options</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {validRecords.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Valid Records</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {invalidRecords.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invalid Records
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {validationResults.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (validRecords.length / validationResults.length) * 100
                    )}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="valid" className="space-y-4">
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {validRecords.slice(0, 10).map((result, index) => (
                <div key={index} className="rounded border bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{result.data?.name}</span>
                    <Badge variant="outline">{result.data?.category}</Badge>
                  </div>
                  {result.warnings.length > 0 && (
                    <div className="mt-2 text-sm text-amber-600">
                      Warnings: {result.warnings.join(', ')}
                    </div>
                  )}
                </div>
              ))}
              {validRecords.length > 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  ... and {validRecords.length - 10} more valid records
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="invalid" className="space-y-4">
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {invalidRecords.map((result, index) => (
                <div key={index} className="rounded border bg-red-50 p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Row {result.row_number}</span>
                  </div>
                  <div className="mt-2 text-sm text-red-600">
                    {result.errors.map((error, i) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="skip_duplicates"
                    checked={importOptions.skip_duplicates}
                    onCheckedChange={checked =>
                      setImportOptions(prev => ({
                        ...prev,
                        skip_duplicates: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="skip_duplicates">
                    Skip duplicate businesses
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto_geocode"
                    checked={importOptions.auto_geocode}
                    onCheckedChange={checked =>
                      setImportOptions(prev => ({
                        ...prev,
                        auto_geocode: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="auto_geocode">Auto-geocode addresses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="validate_only"
                    checked={importOptions.validate_only}
                    onCheckedChange={checked =>
                      setImportOptions(prev => ({
                        ...prev,
                        validate_only: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="validate_only">
                    Validation only (don't import)
                  </Label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="batch_size">Batch Size</Label>
                  <Input
                    id="batch_size"
                    type="number"
                    value={importOptions.batch_size}
                    onChange={e =>
                      setImportOptions(prev => ({
                        ...prev,
                        batch_size: parseInt(e.target.value) || 100,
                      }))
                    }
                    min="10"
                    max="1000"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Number of records to process at once
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setUploadStep('mapping')}>
            Back to Mapping
          </Button>
          <Button
            onClick={startImport}
            disabled={validRecords.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Import ({validRecords.length} records)
          </Button>
        </div>
      </div>
    );
  };

  const renderImportStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Importing Businesses</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we import your business data...
        </p>
      </div>

      {importProgress && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{importProgress.progress_percentage}%</span>
            </div>
            <Progress value={importProgress.progress_percentage} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="text-2xl font-bold">
                {importProgress.current_record}
              </div>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {importProgress.total_records}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {importProgress.successful_imports}
              </div>
              <p className="text-xs text-muted-foreground">Success</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {importProgress.failed_imports}
              </div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>

          {importProgress.status === 'processing' && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Processing records...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle className="mb-4 h-16 w-16 text-green-600" />
        <h3 className="text-xl font-semibold">Import Complete!</h3>
        <p className="text-muted-foreground">
          Your business data has been successfully imported.
        </p>
      </div>

      {importProgress && (
        <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {importProgress.successful_imports}
              </div>
              <p className="text-sm text-muted-foreground">
                Successfully Imported
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {importProgress.failed_imports}
              </div>
              <p className="text-sm text-muted-foreground">Failed to Import</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button onClick={resetImport}>Import Another File</Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = '/admin/businesses')}
        >
          View Businesses
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Business Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploadStep === 'upload' && renderUploadStep()}
        {uploadStep === 'mapping' && renderMappingStep()}
        {uploadStep === 'validation' && renderValidationStep()}
        {uploadStep === 'import' && renderImportStep()}
        {uploadStep === 'complete' && renderCompleteStep()}
      </CardContent>
    </Card>
  );
}
