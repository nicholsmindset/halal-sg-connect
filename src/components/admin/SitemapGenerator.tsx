import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Download,
  RefreshCw,
  CheckCircle,
  FileText,
  Search,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { SitemapGenerator } from '@/lib/sitemap-generator';
import { useToast } from '@/hooks/use-toast';

export default function SitemapGeneratorComponent() {
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [stats, setStats] = useState<{
    totalUrls: number;
    businessUrls: number;
    seoUrls: number;
    staticUrls: number;
  } | null>(null);
  const { toast } = useToast();

  const generateSitemap = async () => {
    try {
      setGenerating(true);
      
      toast({
        title: 'Generating sitemap',
        description: 'This may take a few minutes...'
      });

      const { sitemap, robotsTxt, sitemapIndex } = await SitemapGenerator.generateAndSaveSitemaps();
      
      // Count URLs in sitemap
      const urlMatches = sitemap.match(/<url>/g);
      const totalUrls = urlMatches ? urlMatches.length : 0;
      
      // Estimate URL distribution (approximate)
      const businessUrlMatches = sitemap.match(/\/listing\//g);
      const seoUrlMatches = sitemap.match(/\/(category|features|price)\//g);
      const businessUrls = businessUrlMatches ? businessUrlMatches.length : 0;
      const seoUrls = seoUrlMatches ? seoUrlMatches.length : 0;
      const staticUrls = totalUrls - businessUrls - seoUrls;

      setStats({
        totalUrls,
        businessUrls,
        seoUrls,
        staticUrls
      });

      setLastGenerated(new Date());
      
      // Create downloadable files
      const sitemapBlob = new Blob([sitemap], { type: 'application/xml' });
      const robotsBlob = new Blob([robotsTxt], { type: 'text/plain' });
      
      // Auto-download sitemap
      const sitemapUrl = URL.createObjectURL(sitemapBlob);
      const sitemapLink = document.createElement('a');
      sitemapLink.href = sitemapUrl;
      sitemapLink.download = 'sitemap.xml';
      sitemapLink.click();
      URL.revokeObjectURL(sitemapUrl);
      
      toast({
        title: 'Sitemap generated successfully',
        description: `Generated ${totalUrls} URLs. Files are ready for download.`
      });
    } catch (error: any) {
      toast({
        title: 'Sitemap generation failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadRobotsTxt = async () => {
    try {
      const robotsTxt = SitemapGenerator.generateRobotsTxt();
      const blob = new Blob([robotsTxt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'robots.txt';
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'robots.txt downloaded',
        description: 'File has been downloaded successfully.'
      });
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const testSitemapEndpoint = async () => {
    try {
      const response = await fetch('/.netlify/functions/generate-sitemap?type=sitemap');
      if (response.ok) {
        toast({
          title: 'Sitemap endpoint working',
          description: 'The sitemap API endpoint is functioning correctly.'
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      toast({
        title: 'Endpoint test failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sitemap Generator</h2>
          <p className="text-muted-foreground">
            Generate and manage XML sitemaps for search engine optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testSitemapEndpoint}>
            <Search className="w-4 h-4 mr-2" />
            Test Endpoint
          </Button>
          <Button onClick={generateSitemap} disabled={generating}>
            {generating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 mr-2" />
            )}
            Generate Sitemap
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {lastGenerated ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <div className="text-sm font-medium">
                  {lastGenerated ? 'Generated' : 'Not Generated'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {lastGenerated 
                    ? lastGenerated.toLocaleString()
                    : 'Never'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {stats?.totalUrls || 0}
            </div>
            <p className="text-sm text-muted-foreground">Total URLs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.businessUrls || 0}
            </div>
            <p className="text-sm text-muted-foreground">Business Listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats?.seoUrls || 0}
            </div>
            <p className="text-sm text-muted-foreground">SEO Pages</p>
          </CardContent>
        </Card>
      </div>

      {/* Sitemap Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Sitemap Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Included URL Types</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Static Pages</span>
                  <Badge variant="secondary">{stats?.staticUrls || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Business Listings</span>
                  <Badge variant="secondary">{stats?.businessUrls || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Category Pages</span>
                  <Badge variant="secondary">~50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Location Pages</span>
                  <Badge variant="secondary">~30</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SEO Combination Pages</span>
                  <Badge variant="secondary">{stats?.seoUrls || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Feature Pages</span>
                  <Badge variant="secondary">~10</Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">SEO Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Update Frequency</span>
                  <span className="text-muted-foreground">Weekly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority Scaling</span>
                  <span className="text-muted-foreground">0.5 - 1.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Modified</span>
                  <span className="text-muted-foreground">Auto-detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>XML Format</span>
                  <span className="text-muted-foreground">Sitemap 0.9</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={downloadRobotsTxt}>
              <Download className="w-4 h-4 mr-2" />
              Download robots.txt
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="/.netlify/functions/generate-sitemap?type=sitemap" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Sitemap
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="/.netlify/functions/generate-sitemap?type=robots" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live robots.txt
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Upload to Website Root</h4>
            <p className="text-sm text-muted-foreground">
              After generating, upload the <code>sitemap.xml</code> and <code>robots.txt</code> files 
              to your website's root directory (same location as index.html).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Submit to Search Engines</h4>
            <p className="text-sm text-muted-foreground">
              Submit your sitemap to Google Search Console and Bing Webmaster Tools:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Google: https://search.google.com/search-console</li>
              <li>Bing: https://www.bing.com/webmasters</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Automatic Updates</h4>
            <p className="text-sm text-muted-foreground">
              The sitemap endpoint at <code>/.netlify/functions/generate-sitemap</code> provides 
              real-time sitemap generation. Consider setting up a scheduled job to regenerate 
              sitemaps regularly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}