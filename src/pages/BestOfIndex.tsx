import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Star,
  TrendingUp,
  Users,
  Heart,
  Sparkles,
  MapPin,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function BestOfIndex() {
  useSEO({
    title: 'Best Of Halal Dining in Singapore - Curated Lists',
    description:
      'Discover the best halal restaurants, cafes, and food in Singapore. Handpicked curated lists for every occasion and taste.',
    keywords:
      'best halal restaurants Singapore, top halal food, best halal cafes, curated halal dining lists',
    canonical: '/best'
  });

  const curatedLists = [
    {
      slug: 'best-halal-restaurants-singapore',
      title: 'Best Halal Restaurants in Singapore 2024',
      description:
        'Top-rated establishments with exceptional food and service',
      icon: Award,
      count: 20,
      featured: true
    },
    {
      slug: 'top-halal-cafes-orchard',
      title: 'Top 10 Halal Cafes in Orchard',
      description: 'Trendy cafes perfect for brunch and coffee',
      icon: Sparkles,
      count: 10,
      featured: true
    },
    {
      slug: 'family-friendly-halal-dining-tampines',
      title: 'Best Family-Friendly Halal Restaurants in Tampines',
      description: 'Kid-friendly menus and spacious seating',
      icon: Users,
      count: 15,
      featured: true
    },
    {
      slug: 'budget-halal-food-singapore',
      title: 'Best Budget Halal Food in Singapore',
      description: 'Great value meals under $15',
      icon: Heart,
      count: 25,
      featured: true
    },
    {
      slug: 'premium-halal-dining-singapore',
      title: 'Premium Halal Fine Dining',
      description: 'Upscale restaurants for special occasions',
      icon: Star,
      count: 12,
      featured: false
    },
    {
      slug: 'trending-halal-restaurants',
      title: 'Trending Halal Restaurants Right Now',
      description: 'Hot and happening halal eateries',
      icon: TrendingUp,
      count: 20,
      featured: false
    },
    {
      slug: 'best-halal-food-delivery',
      title: 'Best Halal Food Delivery Options',
      description: 'Top-rated restaurants with delivery services',
      icon: Award,
      count: 20,
      featured: false
    },
    {
      slug: 'halal-restaurants-prayer-facilities',
      title: 'Halal Restaurants with Prayer Facilities',
      description: 'Muslim-friendly dining with dedicated prayer rooms',
      icon: MapPin,
      count: 15,
      featured: false
    }
  ];

  const featuredLists = curatedLists.filter(list => list.featured);
  const otherLists = curatedLists.filter(list => !list.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Curated Collections
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Best Of Halal Dining
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Handpicked collections of the finest halal restaurants, cafes, and
              eateries in Singapore. Every establishment is MUIS-certified and
              community-rated.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                MUIS Verified
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Community Rated
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Regularly Updated
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Lists */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold">Featured Collections</h2>
            <p className="text-muted-foreground">
              Our most popular curated lists, loved by the community
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredLists.map(list => {
              const IconComponent = list.icon;
              return (
                <Card
                  key={list.slug}
                  className="group transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">
                        {list.count} Places
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">
                      {list.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      {list.description}
                    </p>
                    <Button
                      asChild
                      variant="default"
                      className="w-full group-hover:bg-primary/90"
                    >
                      <Link to={`/best/${list.slug}`}>
                        Explore List
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* More Collections */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold">More Collections</h2>
            <p className="text-muted-foreground">
              Specialized lists for every dining preference
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {otherLists.map(list => {
              const IconComponent = list.icon;
              return (
                <Card
                  key={list.slug}
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        {list.count}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold">{list.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {list.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      <Link to={`/best/${list.slug}`}>
                        View List
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Browse by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Button asChild variant="outline">
                  <Link to="/category/restaurants">
                    <Award className="mr-2 h-4 w-4" />
                    Restaurants
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/category/cafes">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Cafes
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/category/fast-food">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Fast Food
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/category/bakery">
                    <Heart className="mr-2 h-4 w-4" />
                    Bakeries
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why Our Lists */}
        <section>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center">
                Why Trust Our Curated Lists?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">100% Halal Verified</h3>
                  <p className="text-sm text-muted-foreground">
                    Every restaurant is MUIS-certified and regularly verified
                    for authenticity
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Community-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Ratings and reviews from real customers, not paid
                    promotions
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Always Fresh</h3>
                  <p className="text-sm text-muted-foreground">
                    Lists are updated weekly based on latest ratings and new
                    additions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
