import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Home,
  Search,
  MapPin,
  Utensils,
  ArrowLeft,
  Coffee,
  Building2,
} from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  // Popular districts for suggestions
  const popularDistricts = [
    { name: 'Orchard', slug: 'orchard' },
    { name: 'Tampines', slug: 'tampines' },
    { name: 'Jurong East', slug: 'jurong-east' },
    { name: 'Clementi', slug: 'clementi' },
    { name: 'Woodlands', slug: 'woodlands' },
    { name: 'Hougang', slug: 'hougang' },
  ];

  // Popular categories
  const popularCategories = [
    { name: 'Restaurants', slug: 'restaurants', icon: Utensils },
    { name: 'Cafes', slug: 'cafes', icon: Coffee },
    { name: 'Fast Food', slug: 'fast-food', icon: Utensils },
  ];

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Halal SG Connect</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Explore our halal business directory across Singapore."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            {/* Error Message Section */}
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8">
                <h1 className="mb-4 bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-8xl font-bold text-transparent">
                  404
                </h1>
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  Oops! Page Not Found
                </h2>
                <p className="mb-2 text-lg text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <p className="text-sm text-muted-foreground">
                  Attempted path:{' '}
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {location.pathname}
                  </code>
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mb-12 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/listings">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Listings
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/districts">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Districts
                  </Link>
                </Button>
              </div>

              {/* Suggestions Section */}
              <div className="mx-auto max-w-5xl space-y-8">
                {/* Popular Categories */}
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Explore Popular Categories
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {popularCategories.map(category => {
                      const Icon = category.icon;
                      return (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          className="group rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-foreground">
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Browse all
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>

                {/* Popular Districts */}
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Search by Popular Districts
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularDistricts.map(district => (
                      <Link
                        key={district.slug}
                        to={`/district/${district.slug}`}
                        className="group rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {district.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="link">
                      <Link to="/districts">View all districts →</Link>
                    </Button>
                  </div>
                </Card>

                {/* Help Section */}
                <Card className="border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
                  <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        Looking for something specific?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Use our search to find halal businesses across Singapore,
                        or browse by category and district.
                      </p>
                    </div>
                    <Button asChild>
                      <Link to="/listings">
                        Start Exploring
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
