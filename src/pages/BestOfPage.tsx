import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/ListingCard';
import {
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  MapPin,
  Filter,
  Users,
  Heart,
  Sparkles
} from 'lucide-react';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { useSEO } from '@/hooks/useSEO';

interface BestOfConfig {
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType;
  filters: {
    category?: string;
    district?: string;
    feature?: string;
    minRating?: number;
    priceRange?: string;
    isPremium?: boolean;
  };
  sortBy: 'rating' | 'reviewCount' | 'trending';
  limit: number;
}

// Curated "Best Of" list configurations
const BEST_OF_LISTS: Record<string, BestOfConfig> = {
  'best-halal-restaurants-singapore': {
    slug: 'best-halal-restaurants-singapore',
    title: 'Best Halal Restaurants in Singapore 2024',
    description:
      'Discover Singapore\'s finest halal-certified restaurants. Top-rated establishments with exceptional food, service, and authentic flavors.',
    icon: Award,
    filters: { minRating: 4.5 },
    sortBy: 'rating',
    limit: 20
  },
  'top-halal-cafes-orchard': {
    slug: 'top-halal-cafes-orchard',
    title: 'Top 10 Halal Cafes in Orchard Singapore',
    description:
      'Trendy halal-certified cafes in Orchard Road. Perfect for brunch, coffee, and Instagram-worthy desserts.',
    icon: Sparkles,
    filters: { category: 'cafes', district: 'Orchard', minRating: 4.0 },
    sortBy: 'rating',
    limit: 10
  },
  'family-friendly-halal-dining-tampines': {
    slug: 'family-friendly-halal-dining-tampines',
    title: 'Best Family-Friendly Halal Restaurants in Tampines',
    description:
      'Family-oriented halal dining in Tampines. Kid-friendly menus, spacious seating, and excellent service.',
    icon: Users,
    filters: { feature: 'family-friendly', district: 'Tampines' },
    sortBy: 'reviewCount',
    limit: 15
  },
  'budget-halal-food-singapore': {
    slug: 'budget-halal-food-singapore',
    title: 'Best Budget Halal Food in Singapore',
    description:
      'Affordable halal dining without compromising quality. Great value meals and local favorites under $15.',
    icon: Heart,
    filters: { priceRange: 'budget', minRating: 4.0 },
    sortBy: 'rating',
    limit: 25
  },
  'premium-halal-dining-singapore': {
    slug: 'premium-halal-dining-singapore',
    title: 'Premium Halal Fine Dining in Singapore',
    description:
      'Upscale halal restaurants for special occasions. Elegant ambiance, exquisite cuisine, and impeccable service.',
    icon: Star,
    filters: { priceRange: 'premium', minRating: 4.5, isPremium: true },
    sortBy: 'rating',
    limit: 12
  },
  'trending-halal-restaurants': {
    slug: 'trending-halal-restaurants',
    title: 'Trending Halal Restaurants Right Now',
    description:
      'Hot and happening halal eateries. Newly opened gems and viral food spots everyone is talking about.',
    icon: TrendingUp,
    filters: { minRating: 4.0 },
    sortBy: 'trending',
    limit: 20
  },
  'best-halal-food-delivery': {
    slug: 'best-halal-food-delivery',
    title: 'Best Halal Food Delivery Options',
    description:
      'Top-rated halal restaurants with delivery services. Enjoy authentic halal cuisine from the comfort of home.',
    icon: Award,
    filters: { feature: 'delivery-available', minRating: 4.0 },
    sortBy: 'rating',
    limit: 20
  },
  'halal-restaurants-prayer-facilities': {
    slug: 'halal-restaurants-prayer-facilities',
    title: 'Halal Restaurants with Prayer Facilities',
    description:
      'Muslim-friendly dining with dedicated prayer rooms. Dine with peace of mind and convenience.',
    icon: MapPin,
    filters: { feature: 'prayer-facilities', minRating: 4.0 },
    sortBy: 'rating',
    limit: 15
  }
};

export default function BestOfPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<BestOfConfig | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate('/404');
      return;
    }

    const listConfig = BEST_OF_LISTS[slug];
    if (!listConfig) {
      navigate('/404');
      return;
    }

    setConfig(listConfig);
    loadBusinesses(listConfig);
  }, [slug, navigate]);

  // SEO configuration
  useSEO({
    title: config?.title || 'Best Of Halal Dining',
    description: config?.description || '',
    keywords: `best halal restaurants, ${slug.replace(/-/g, ' ')}, top halal food Singapore`,
    canonical: `/best/${slug}`
  });

  const loadBusinesses = async (listConfig: BestOfConfig) => {
    try {
      setLoading(true);
      let query = supabase
        .from('business_search_view')
        .select('*')
        .eq('verification_status', 'verified');

      // Apply filters
      if (listConfig.filters.category) {
        query = query.contains('category_slugs', [listConfig.filters.category]);
      }
      if (listConfig.filters.district) {
        query = query.ilike('district', `%${listConfig.filters.district}%`);
      }
      if (listConfig.filters.feature) {
        query = query.contains('features', [listConfig.filters.feature]);
      }
      if (listConfig.filters.minRating) {
        query = query.gte('rating', listConfig.filters.minRating);
      }
      if (listConfig.filters.priceRange) {
        query = query.eq('price_range', listConfig.filters.priceRange);
      }
      if (listConfig.filters.isPremium) {
        query = query.eq('is_premium', true);
      }

      // Apply sorting
      if (listConfig.sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else if (listConfig.sortBy === 'reviewCount') {
        query = query.order('review_count', { ascending: false });
      } else if (listConfig.sortBy === 'trending') {
        // Trending = high rating + recent reviews
        query = query.order('rating', { ascending: false });
      }

      query = query.limit(listConfig.limit);

      const { data, error } = await query;

      if (error) {
        console.error('Error loading businesses:', error);
        return;
      }

      setBusinesses(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !config) {
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

  const IconComponent = config.icon;

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <link rel="canonical" href={`https://halal-sg-connect.netlify.app/best/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Breadcrumbs */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/best" className="hover:text-foreground">
                Best Of
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{config.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {config.title}
                </h1>
                <Badge variant="secondary" className="mt-2">
                  {businesses.length} Curated Selections
                </Badge>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              {config.description}
            </p>
          </div>

          {/* Filter Badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            {config.filters.minRating && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {config.filters.minRating}+ Rating
              </Badge>
            )}
            {config.filters.category && (
              <Badge variant="outline">
                {config.filters.category.charAt(0).toUpperCase() +
                  config.filters.category.slice(1)}
              </Badge>
            )}
            {config.filters.district && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {config.filters.district}
              </Badge>
            )}
            {config.filters.feature && (
              <Badge variant="outline">
                {config.filters.feature.replace(/-/g, ' ')}
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              MUIS Certified
            </Badge>
          </div>

          {/* Listings Grid */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Featured Establishments
              </h2>
              <p className="text-sm text-muted-foreground">
                Handpicked by our community and rated by real customers
              </p>
            </div>

            {businesses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businesses.map((business, index) => (
                  <div key={business.id} className="relative">
                    {index < 3 && (
                      <Badge
                        className="absolute -left-2 -top-2 z-10"
                        variant={
                          index === 0
                            ? 'default'
                            : index === 1
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        #{index + 1}
                      </Badge>
                    )}
                    <ListingCard listing={business} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No businesses found matching these criteria.
                </p>
              </Card>
            )}
          </div>

          {/* More Best Of Lists */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Explore More Curated Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Object.values(BEST_OF_LISTS)
                  .filter(list => list.slug !== slug)
                  .slice(0, 6)
                  .map(list => {
                    const ListIcon = list.icon;
                    return (
                      <Button
                        key={list.slug}
                        asChild
                        variant="outline"
                        className="h-auto justify-start p-4"
                      >
                        <Link to={`/best/${list.slug}`}>
                          <ListIcon className="mr-2 h-5 w-5 text-primary" />
                          <span className="text-sm">{list.title}</span>
                        </Link>
                      </Button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Why Trust These Recommendations */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Why Trust These Recommendations?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">MUIS Verified</h4>
                    <p className="text-sm text-muted-foreground">
                      All restaurants are halal-certified by MUIS
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Community Rated</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on authentic reviews from real customers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Regularly Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      Lists are refreshed to reflect current quality
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
}
