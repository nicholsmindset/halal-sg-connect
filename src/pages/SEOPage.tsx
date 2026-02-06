import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ListingCard from '@/components/ListingCard';
import {
  MapPin,
  Star,
  TrendingUp,
  Filter,
  ChevronRight,
  Search,
} from 'lucide-react';
import { SEOPage as SEOPageType, SEOPageContent } from '@/types/import';
import { supabase } from '@/integrations/supabase/client';

// District mapping from Districts.tsx
const districtData: Record<string, { name: string; region: string; type: string }> = {
  orchard: { name: 'Orchard', region: 'Central Region', type: 'Tourist & Shopping' },
  'marina-south': { name: 'Marina Bay', region: 'Central Region', type: 'Business & Tourist' },
  'downtown-core': { name: 'Raffles Place', region: 'Central Region', type: 'Financial District' },
  rochor: { name: 'Bugis / Arab Street', region: 'Central Region', type: 'Cultural Heritage' },
  'little-india': { name: 'Little India', region: 'Central Region', type: 'Cultural Heritage' },
  outram: { name: 'Chinatown', region: 'Central Region', type: 'Heritage & Business' },
  'singapore-river': { name: 'Clarke Quay', region: 'Central Region', type: 'Entertainment' },
  newton: { name: 'Newton', region: 'Central Region', type: 'Hawker & Medical' },
  novena: { name: 'Novena', region: 'Central Region', type: 'Medical Hub' },
  'bukit-timah': { name: 'Bukit Timah', region: 'Central Region', type: 'Upscale Residential' },
  tanglin: { name: 'Tanglin', region: 'Central Region', type: 'Embassy District' },
  'river-valley': { name: 'River Valley', region: 'Central Region', type: 'Urban Living' },
  'toa-payoh': { name: 'Toa Payoh', region: 'Central Region', type: 'Mature Estate' },
  queenstown: { name: 'Queenstown', region: 'Central Region', type: 'Heritage Estate' },
  'bukit-merah': { name: 'Bukit Merah', region: 'Central Region', type: 'Central Living' },
  geylang: { name: 'Geylang', region: 'Central Region', type: 'Cultural Hub' },
  kallang: { name: 'Kallang', region: 'Central Region', type: 'Sports Hub' },
  tampines: { name: 'Tampines', region: 'East Region', type: 'Regional Hub' },
  bedok: { name: 'Bedok', region: 'East Region', type: 'Family Residential' },
  'pasir-ris': { name: 'Pasir Ris', region: 'East Region', type: 'Beach & Family' },
  changi: { name: 'Changi Airport', region: 'East Region', type: 'International Hub' },
  'paya-lebar': { name: 'Paya Lebar', region: 'East Region', type: 'Commercial' },
  'marine-parade': { name: 'Marine Parade', region: 'East Region', type: 'Beachfront' },
  'changi-village': { name: 'Changi Village', region: 'East Region', type: 'Coastal Village' },
  'jurong-east': { name: 'Jurong East', region: 'West Region', type: 'Regional Hub' },
  'jurong-west': { name: 'Jurong West', region: 'West Region', type: 'Family Residential' },
  clementi: { name: 'Clementi', region: 'West Region', type: 'University Town' },
  'boon-lay': { name: 'Boon Lay', region: 'West Region', type: 'Mixed Development' },
  'bukit-batok': { name: 'Bukit Batok', region: 'West Region', type: 'Residential' },
  'choa-chu-kang': { name: 'Choa Chu Kang', region: 'West Region', type: 'Family Area' },
  'bukit-panjang': { name: 'Bukit Panjang', region: 'West Region', type: 'Residential' },
  pioneer: { name: 'Pioneer', region: 'West Region', type: 'Industrial' },
  tengah: { name: 'Tengah Smart Town', region: 'West Region', type: 'New Smart Town' },
  tuas: { name: 'Tuas', region: 'West Region', type: 'Industrial Hub' },
  'west-coast': { name: 'West Coast', region: 'West Region', type: 'Waterfront' },
  woodlands: { name: 'Woodlands', region: 'North Region', type: 'Border Town' },
  yishun: { name: 'Yishun', region: 'North Region', type: 'Family Community' },
  sembawang: { name: 'Sembawang', region: 'North Region', type: 'Quiet Residential' },
  mandai: { name: 'Mandai', region: 'North Region', type: 'Nature & Zoo' },
  seletar: { name: 'Seletar', region: 'North Region', type: 'Aerospace Hub' },
  'lim-chu-kang': { name: 'Lim Chu Kang', region: 'North Region', type: 'Rural & Farms' },
  'sungei-kadut': { name: 'Sungei Kadut', region: 'North Region', type: 'Industrial' },
  hougang: { name: 'Hougang', region: 'Northeast Region', type: 'Traditional Town' },
  punggol: { name: 'Punggol', region: 'Northeast Region', type: 'Waterfront New Town' },
  sengkang: { name: 'Sengkang', region: 'Northeast Region', type: 'Modern New Town' },
  'ang-mo-kio': { name: 'Ang Mo Kio', region: 'Northeast Region', type: 'Family Community' },
  bishan: { name: 'Bishan', region: 'Northeast Region', type: 'Park Connector Hub' },
  serangoon: { name: 'Serangoon', region: 'Northeast Region', type: 'Residential Hub' },
};

// Helper function to generate dynamic district page content
async function generateDynamicDistrictPage(districtSlug: string): Promise<any> {
  const district = districtData[districtSlug];

  if (!district) {
    return null;
  }

  // Query businesses in this planning area
  const { data: businesses, error } = await supabase
    .from('business_search_view')
    .select('*')
    .eq('verification_status', 'verified')
    .ilike('planning_area', `%${district.name}%`)
    .order('rating', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error loading businesses for district:', error);
  }

  const businessList = businesses || [];
  const totalCount = businessList.length;
  const avgRating = totalCount > 0
    ? Math.round((businessList.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / totalCount) * 10) / 10
    : 0;

  // Extract popular cuisines
  const cuisineCount: Record<string, number> = {};
  businessList.forEach((b: any) => {
    if (b.cuisine_types && Array.isArray(b.cuisine_types)) {
      b.cuisine_types.forEach((cuisine: string) => {
        cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
      });
    }
  });
  const popularCuisines = Object.entries(cuisineCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cuisine]) => cuisine);

  // Extract top features
  const featureCount: Record<string, number> = {};
  businessList.forEach((b: any) => {
    if (b.features && Array.isArray(b.features)) {
      b.features.forEach((feature: string) => {
        featureCount[feature] = (featureCount[feature] || 0) + 1;
      });
    }
  });
  const topFeatures = Object.entries(featureCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([feature]) => feature);

  // Generate highlights
  const highlights: string[] = [];
  const topRated = businessList.filter((b: any) => b.rating >= 4.5).slice(0, 3);
  if (topRated.length > 0) {
    highlights.push(`Top-rated establishments include ${topRated.map((b: any) => b.name).join(', ')}`);
  }

  const certifiedCount = businessList.filter((b: any) => b.halal_certified).length;
  if (certifiedCount > 0) {
    highlights.push(`${certifiedCount} businesses with verified halal certification`);
  }

  const deliveryCount = businessList.filter((b: any) => b.delivery_platforms && b.delivery_platforms.length > 0).length;
  if (deliveryCount > 0) {
    highlights.push(`${deliveryCount} businesses offering delivery services`);
  }

  highlights.push(`Located in ${district.region}, known for ${district.type.toLowerCase()}`);

  const content: SEOPageContent = {
    intro_text: `Discover ${totalCount > 0 ? totalCount : 'authentic'} halal restaurants and businesses in ${district.name}. This Singapore planning area in the ${district.region} offers diverse halal dining options, from family-friendly neighborhood favorites to specialized cuisine establishments, all with verified halal certification.`,
    highlights: highlights.slice(0, 4),
    local_info: `${district.name} is a vibrant area in Singapore's ${district.region}, characterized by its ${district.type.toLowerCase()} atmosphere. The area is well-connected and offers a diverse range of halal dining and services for residents and visitors alike.`,
    business_stats: {
      total_count: totalCount,
      avg_rating: avgRating,
      price_distribution: {},
      popular_cuisines: popularCuisines,
      top_features: topFeatures,
    },
    faqs: [
      {
        question: `What halal food options are available in ${district.name}?`,
        answer: `${district.name} offers a diverse range of halal dining options, from traditional Malay and Indian cuisine to modern fusion restaurants. Many establishments are MUIS-certified and cater to various budgets and preferences.`,
      },
      {
        question: `How do I get to ${district.name} by public transport?`,
        answer: `${district.name} is well-connected by MRT, bus services, and taxi. Check the specific business listings for detailed directions and the nearest MRT stations.`,
      },
      {
        question: `Are the halal restaurants in ${district.name} certified?`,
        answer: `Yes, all businesses listed on our platform with halal certification have been verified. Look for the MUIS halal certificate badge on business listings.`,
      },
    ],
    related_searches: [
      `halal food ${district.name}`,
      `restaurants ${district.name}`,
      `${district.name} halal dining`,
      `best halal ${district.name}`,
      `MUIS certified ${district.name}`,
      `halal delivery ${district.name}`,
    ],
  };

  return {
    slug: districtSlug,
    page_type: 'district',
    title: `${totalCount > 0 ? totalCount + '+ ' : ''}Halal Businesses in ${district.name} | Singapore Directory`,
    meta_description: `Find halal restaurants and businesses in ${district.name}, Singapore. Discover authentic halal dining in this ${district.type.toLowerCase()} area with verified MUIS certification.`,
    h1_title: `Halal Businesses in ${district.name}`,
    content,
    filters: { planning_area: districtSlug, district: district.name },
    business_count: totalCount,
    view_count: 0,
    last_content_update: new Date().toISOString(),
    is_published: true,
    canonical_url: `https://vocal-puffpuff-8d486c.netlify.app/district/${districtSlug}`,
    schema_markup: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Halal Businesses in ${district.name}`,
      description: content.intro_text,
      url: `https://vocal-puffpuff-8d486c.netlify.app/district/${districtSlug}`,
    },
    related_pages: [],
  };
}

export default function SEOPage() {
  const { '*': slugPath } = useParams();
  const navigate = useNavigate();
  const [seoPage, setSeoPage] = useState<SEOPageType | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugPath) {
      navigate('/404');
      return;
    }

    loadSEOPage(slugPath);
  }, [slugPath, navigate]);

  const loadSEOPage = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      // Extract the actual page identifier from the slug
      // For /district/clementi, we want to search for 'clementi'
      const pathParts = slug.split('/');
      const pageIdentifier = pathParts.length > 1 ? pathParts[1] : slug;

      if (!pageIdentifier) {
        setError('Invalid page path');
        return;
      }

      // First, try to get existing SEO page
      const { data: existingPage } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('slug', pageIdentifier)
        .eq('is_published', true)
        .maybeSingle();

      let seoPageData: any = existingPage;

      // If no existing page found, generate dynamic content for district pages
      if (!seoPageData && slug.startsWith('district/')) {
        const districtSlug = pathParts[1];
        seoPageData = await generateDynamicDistrictPage(districtSlug);

        if (!seoPageData) {
          setError('Page not found');
          navigate('/404');
          return;
        }
      }

      if (!seoPageData) {
        setError('Page not found');
        navigate('/404');
        return;
      }

      setSeoPage(seoPageData);

      // Update view count only if page exists in database
      if (seoPageData.id) {
        await supabase
          .from('seo_pages')
          .update({ view_count: seoPageData.view_count + 1 })
          .eq('id', seoPageData.id);
      }

      // Load businesses based on filters
      await loadBusinesses(seoPageData.filters);
    } catch (err: any) {
      console.error('Error loading SEO page:', err);
      setError(err.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const loadBusinesses = async (filters: Record<string, any>) => {
    try {
      let query = supabase
        .from('business_search_view')
        .select('*')
        .eq('verification_status', 'verified')
        .order('rating', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.contains('category_slugs', [filters.category]);
      }

      if (filters.district) {
        query = query.ilike('district', `%${filters.district}%`);
      }

      // New district-specific filters
      if (filters.planning_area) {
        query = query.eq(
          'planning_area',
          filters.planning_area.replace('-', ' ')
        );
      }

      if (filters.property_district_code) {
        query = query.eq(
          'property_district_code',
          filters.property_district_code
        );
      }

      if (filters.halal_certified) {
        query = query.eq('halal_certified', true);
      }

      if (filters.price_range) {
        query = query.eq('price_range', filters.price_range);
      }

      if (filters.feature) {
        query = query.contains('features', [filters.feature]);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error loading businesses:', error);
        return;
      }

      setBusinesses(data || []);
    } catch (err) {
      console.error('Error loading businesses:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 rounded-t bg-muted" />
                  <CardContent className="space-y-2 p-4">
                    <div className="h-4 rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seoPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Page Not Found</h1>
          <p className="mb-4 text-muted-foreground">
            {error || "The page you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const content = seoPage.content as SEOPageContent;

  return (
    <>
      <Helmet>
        <title>{seoPage.title}</title>
        <meta name="description" content={seoPage.meta_description} />
        <meta property="og:title" content={seoPage.title} />
        <meta property="og:description" content={seoPage.meta_description} />
        <meta property="og:url" content={seoPage.canonical_url} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={seoPage.canonical_url} />
        {seoPage.schema_markup && (
          <script type="application/ld+json">
            {JSON.stringify(seoPage.schema_markup)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumbs */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <ChevronRight className="h-4 w-4" />

              {/* Enhanced breadcrumbs for district and property zone pages */}
              {seoPage.page_type === 'district' && (
                <>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => navigate('/districts')}
                  >
                    Districts
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}

              {seoPage.page_type === 'district_category' && (
                <>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => navigate('/districts')}
                  >
                    Districts
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() =>
                      navigate(`/district/${slugPath?.split('/')[1]}`)
                    }
                  >
                    {slugPath?.split('/')[1]?.replace('-', ' ')}
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}

              {seoPage.page_type === 'property_zone' && (
                <>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => navigate('/property-zones')}
                  >
                    Property Zones
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}

              {seoPage.page_type === 'property_zone_category' && (
                <>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => navigate('/property-zones')}
                  >
                    Property Zones
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() =>
                      navigate(`/property-zone/${slugPath?.split('/')[1]}`)
                    }
                  >
                    {slugPath?.split('/')[1]?.toUpperCase()}
                  </Button>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}

              <span className="text-foreground">{seoPage.h1_title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {seoPage.h1_title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {content.intro_text}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {content.business_stats.total_count}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Businesses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {content.business_stats.avg_rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {businesses.filter(b => b.halal_certified).length}
                </div>
                <p className="text-sm text-muted-foreground">Halal Certified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {businesses.filter(b => b.is_premium).length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Premium Listings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Highlights */}
          {content.highlights.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Key Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Popular Categories/Features */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {content.business_stats.popular_cuisines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Cuisines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {content.business_stats.popular_cuisines.map(
                      (cuisine, index) => (
                        <Badge key={index} variant="secondary">
                          {cuisine}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {content.business_stats.top_features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {content.business_stats.top_features.map(
                      (feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Local Information */}
          {content.local_info && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Area Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{content.local_info}</p>
              </CardContent>
            </Card>
          )}

          {/* Business Listings */}
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Businesses</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  Showing {businesses.length} results
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.slice(0, 12).map(business => (
                <ListingCard key={business.id} listing={business} />
              ))}
            </div>

            {businesses.length > 12 && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => navigate('/listings')}>
                  View All {content.business_stats.total_count} Businesses
                </Button>
              </div>
            )}
          </div>

          {/* FAQs */}
          {content.faqs.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.faqs.map((faq, index) => (
                  <div key={index}>
                    <h3 className="mb-2 font-semibold">{faq.question}</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                    {index < content.faqs.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related Searches */}
          {content.related_searches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Related Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.related_searches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() =>
                        navigate(`/search?q=${encodeURIComponent(search)}`)
                      }
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
