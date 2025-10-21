import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Calendar,
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';

interface AnalyticsData {
  views: { date: string; views: number; uniqueViews: number }[];
  clicks: { date: string; clicks: number; ctr: number }[];
  conversion: { source: string; conversions: number; percentage: number }[];
  demographics: { age: string; count: number }[];
  timeMetrics: { hour: string; traffic: number }[];
  referrals: { source: string; count: number; color: string }[];
  keyMetrics: {
    totalViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: string;
    conversionRate: number;
    bounceRate: number;
    weeklyGrowth: number;
  };
}

interface AnalyticsDashboardProps {
  businessId: string;
  subscriptionTier: 'free' | 'premium' | 'premium_plus' | 'enterprise';
}

const AnalyticsDashboard = ({
  businessId,
  subscriptionTier,
}: AnalyticsDashboardProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // Generate mock analytics data
  const generateAnalyticsData = async (): Promise<AnalyticsData> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return {
      views: dates.map(date => ({
        date,
        views: Math.floor(Math.random() * 100 + 20),
        uniqueViews: Math.floor(Math.random() * 60 + 15),
      })),
      clicks: dates.map(date => ({
        date,
        clicks: Math.floor(Math.random() * 25 + 5),
        ctr: Math.random() * 0.15 + 0.05,
      })),
      conversion: [
        { source: 'Organic Search', conversions: 45, percentage: 35 },
        { source: 'Social Media', conversions: 32, percentage: 25 },
        { source: 'Direct', conversions: 28, percentage: 22 },
        { source: 'Referrals', conversions: 23, percentage: 18 },
      ],
      demographics: [
        { age: '18-25', count: 15 },
        { age: '26-35', count: 35 },
        { age: '36-45', count: 28 },
        { age: '46-55', count: 22 },
      ],
      timeMetrics: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        traffic: Math.floor(Math.random() * 50 + 10),
      })),
      referrals: [
        { source: 'Google', count: 45, color: '#4285F4' },
        { source: 'Facebook', count: 32, color: '#1877F2' },
        { source: 'Instagram', count: 25, color: '#E4405F' },
        { source: 'Others', count: 18, color: '#64748B' },
      ],
      keyMetrics: {
        totalViews: 2340,
        uniqueVisitors: 1876,
        avgTimeOnPage: '2m 34s',
        conversionRate: 12.5,
        bounceRate: 34.2,
        weeklyGrowth: 8.3,
      },
    };
  };

  const generateAIInsights = (data: AnalyticsData): string[] => {
    const insights = [];

    if (data.keyMetrics.weeklyGrowth > 5) {
      insights.push(
        '📈 Your listing is experiencing strong growth! Views increased by 8.3% this week.'
      );
    }

    if (data.keyMetrics.conversionRate > 10) {
      insights.push(
        '🎯 Excellent conversion rate! Your listing effectively converts visitors to customers.'
      );
    }

    const peakHour = data.timeMetrics.reduce((max, current) =>
      current.traffic > max.traffic ? current : max
    );
    insights.push(
      `⏰ Peak traffic occurs around ${peakHour.hour}. Consider posting updates during this time.`
    );

    const topSource = data.conversion[0];
    insights.push(
      `🔍 ${topSource.source} is your top traffic source (${topSource.percentage}%). Focus on optimizing this channel.`
    );

    if (data.keyMetrics.bounceRate < 40) {
      insights.push(
        '✨ Low bounce rate indicates visitors find your content engaging!'
      );
    }

    return insights;
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      const data = await generateAnalyticsData();
      setAnalyticsData(data);
      setAiInsights(generateAIInsights(data));
      setIsLoading(false);
    };

    loadAnalytics();
  }, [businessId, timeRange]);

  const canAccessFeature = (feature: 'basic' | 'advanced' | 'enterprise') => {
    const tierLevels = { free: 0, premium: 1, premium_plus: 2, enterprise: 3 };
    const featureLevels = { basic: 1, advanced: 2, enterprise: 3 };
    return tierLevels[subscriptionTier] >= featureLevels[feature];
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const UpgradePrompt = ({ feature }: { feature: string }) => (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardContent className="p-8 text-center">
        <div className="mb-4 text-muted-foreground">
          <TrendingUp className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <h3 className="text-lg font-semibold">Unlock {feature}</h3>
          <p>Upgrade to Premium Plus to access advanced analytics features.</p>
        </div>
        <Button>Upgrade Plan</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Insights */}
      {canAccessFeature('advanced') && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
              <Badge variant="secondary">Premium Plus</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {analyticsData.keyMetrics.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">
                +{analyticsData.keyMetrics.weeklyGrowth}%
              </span>
              <span className="ml-1 text-muted-foreground">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">
                  {analyticsData.keyMetrics.uniqueVisitors.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">
                Avg. Time: {analyticsData.keyMetrics.avgTimeOnPage}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {analyticsData.keyMetrics.conversionRate}%
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">
                Bounce Rate: {analyticsData.keyMetrics.bounceRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">
                  +{analyticsData.keyMetrics.weeklyGrowth}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500">Strong performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-4">
        <TabsList>
          <TabsTrigger value="views">Views & Traffic</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          {canAccessFeature('advanced') && (
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          )}
          {canAccessFeature('enterprise') && (
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.views}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueViews"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.referrals}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.referrals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.conversion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          {canAccessFeature('advanced') ? (
            <Card>
              <CardHeader>
                <CardTitle>Visitor Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.demographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <UpgradePrompt feature="Demographics Analytics" />
          )}
        </TabsContent>

        <TabsContent value="realtime">
          {canAccessFeature('enterprise') ? (
            <Card>
              <CardHeader>
                <CardTitle>Real-time Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.timeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="traffic"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <UpgradePrompt feature="Real-time Analytics" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
