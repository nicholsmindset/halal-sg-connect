import React, { useEffect, useState } from 'react';
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
  Users,
  TrendingUp,
  Filter,
  ChevronRight,
  Search,
  Clock,
  Phone,
  Globe,
} from 'lucide-react';
import { SEOPage as SEOPageType, SEOPageContent } from '@/types/import';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { SEOPageGenerator } from '@/lib/seo-generator';

export default function SEOPage() {
  const { '*': slugPath } = useParams();
  const navigate = useNavigate();
  const [seoPage, setSeoPage] = useState<SEOPageType | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
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

      // First, try to get existing SEO page
      const { data: existingPage, error: pageError } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('slug', pageIdentifier)
        .eq('is_published', true)
        .maybeSingle();

      let seoPageData: SEOPageType | null = existingPage;

      // If no existing page, try to generate one
      if (!existingPage && !pageError) {
        const pathParts = slug.split('/');
        let pageType: SEOPageType['page_type'] = 'location';
        let filters: Record<string, any> = {};

        // Determine page type and filters from slug
        if (pathParts[0] === 'category') {
          pageType = 'category';
          filters = { category: pathParts[1] };
        } else if (pathParts[0] === 'features') {
          pageType = 'feature';
          filters = { feature: pathParts[1] };
        } else if (pathParts[0] === 'price') {
          pageType = 'price';
          filters = { price_range: pathParts[1] };
        } else if (pathParts[0] === 'district') {
          // New district-specific routing: /district/tampines or /district/tampines/restaurants
          pageType = pathParts.length === 3 ? 'district_category' : 'district';
          filters =
            pathParts.length === 3
              ? { planning_area: pathParts[1], category: pathParts[2] }
              : { planning_area: pathParts[1] };
        } else if (pathParts[0] === 'property-zone') {
          // New property zone routing: /property-zone/d01 or /property-zone/d01/restaurants
          pageType =
            pathParts.length === 3 ? 'property_zone_category' : 'property_zone';
          filters =
            pathParts.length === 3
              ? {
                  property_district_code: pathParts[1].toUpperCase(),
                  category: pathParts[2],
                }
              : { property_district_code: pathParts[1].toUpperCase() };
        } else if (pathParts.length === 1) {
          pageType = 'location';
          filters = { district: pathParts[0].replace('-', ' ') };
        } else if (pathParts.length === 2) {
          pageType = 'combination';
          filters = {
            district: pathParts[0].replace('-', ' '),
            category: pathParts[1],
          };
        }

        // Generate the page
        seoPageData = await SEOPageGenerator.generateAndStorePage(
          slug,
          pageType,
          filters
        );
      }

      if (!seoPageData) {
        setError('Page not found');
        navigate('/404');
        return;
      }

      setSeoPage(seoPageData);

      // Update view count
      await supabase
        .from('seo_pages')
        .update({ view_count: seoPageData.view_count + 1 })
        .eq('id', seoPageData.id);

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
