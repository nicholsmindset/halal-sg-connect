import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Utensils,
  Coffee,
  ShoppingBag,
  Cake,
  Pizza,
  IceCream,
  Store,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function Categories() {
  useSEO({
    title: 'Halal Business Categories in Singapore | Complete Directory',
    description:
      'Browse all halal business categories in Singapore. Find restaurants, cafes, groceries, bakeries, and more with MUIS certification.',
    keywords:
      'halal categories Singapore, halal restaurants, halal cafes, halal groceries, halal bakeries, halal food categories',
    canonical: '/categories',
  });

  const categories = [
    {
      slug: 'restaurants',
      name: 'Restaurants',
      icon: Utensils,
      description: 'Fine dining and casual restaurants with halal certification',
      count: 850,
      popular: true,
      color: 'bg-red-100 text-red-800',
    },
    {
      slug: 'cafes',
      name: 'Cafes & Coffee Shops',
      icon: Coffee,
      description: 'Cozy cafes serving coffee, brunch, and light meals',
      count: 320,
      popular: true,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      slug: 'fast-food',
      name: 'Fast Food',
      icon: Pizza,
      description: 'Quick service halal fast food chains and outlets',
      count: 180,
      popular: true,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      slug: 'bakery',
      name: 'Bakeries & Pastries',
      icon: Cake,
      description: 'Fresh bread, cakes, and pastries made with halal ingredients',
      count: 145,
      popular: false,
      color: 'bg-pink-100 text-pink-800',
    },
    {
      slug: 'desserts',
      name: 'Desserts & Ice Cream',
      icon: IceCream,
      description: 'Sweet treats, ice cream parlors, and dessert cafes',
      count: 95,
      popular: false,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      slug: 'groceries',
      name: 'Halal Groceries',
      icon: ShoppingBag,
      description: 'Supermarkets and stores selling halal products',
      count: 220,
      popular: true,
      color: 'bg-green-100 text-green-800',
    },
    {
      slug: 'catering',
      name: 'Catering Services',
      icon: Sparkles,
      description: 'Professional halal catering for events and functions',
      count: 125,
      popular: false,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      slug: 'food-courts',
      name: 'Food Courts & Hawkers',
      icon: Store,
      description: 'Halal stalls in food courts and hawker centers',
      count: 280,
      popular: true,
      color: 'bg-teal-100 text-teal-800',
    },
    {
      slug: 'buffet',
      name: 'Buffet Restaurants',
      icon: TrendingUp,
      description: 'All-you-can-eat halal buffets and steamboat',
      count: 45,
      popular: false,
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      slug: 'seafood',
      name: 'Seafood Restaurants',
      icon: Utensils,
      description: 'Fresh halal seafood dining experiences',
      count: 85,
      popular: false,
      color: 'bg-cyan-100 text-cyan-800',
    },
    {
      slug: 'western',
      name: 'Western Cuisine',
      icon: Utensils,
      description: 'Halal western food, steaks, and burgers',
      count: 165,
      popular: false,
      color: 'bg-slate-100 text-slate-800',
    },
    {
      slug: 'asian',
      name: 'Asian Cuisine',
      icon: Utensils,
      description: 'Chinese, Indian, Malay, and other Asian cuisines',
      count: 520,
      popular: true,
      color: 'bg-rose-100 text-rose-800',
    },
  ];

  const popularCategories = categories.filter(c => c.popular);
  const allCategories = categories;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Halal Business Categories
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore Singapore's comprehensive halal directory organized by
            category. From fine dining to everyday groceries, find exactly what
            you're looking for.
          </p>
        </div>

        {/* Popular Categories */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                🌟 Popular Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Most searched categories by our community
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:block">
              {popularCategories.length} categories
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularCategories.map(category => {
              const Icon = category.icon;
              return (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <CardTitle className="flex items-center gap-2">
                        {category.name}
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              All Categories
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete list of halal business categories in Singapore
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allCategories.map(category => {
              const Icon = category.icon;
              return (
                <Link key={category.slug} to={`/category/${category.slug}`}>
                  <Card className="group cursor-pointer transition-all hover:border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary">
                            {category.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {category.count} businesses
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Can't find what you're looking for?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Browse all listings or search for specific businesses
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/listings">Browse All Listings</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/districts">Search by District</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
