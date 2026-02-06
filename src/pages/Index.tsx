import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Crown } from 'lucide-react';
import { mockCategories } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useSEO, SEOConfigs } from '@/hooks/useSEO';

const Index = () => {
  // Apply SEO metadata for homepage
  useSEO(SEOConfigs.home);

  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  // Fetch premium listings from Supabase
  const { data: premiumListings = [] } = useQuery({
    queryKey: ['premium-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_premium', true)
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-soft to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
            Discover Singapore's
            <span className="block bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent">
              Halal Businesses
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Your trusted directory for authentic halal dining, shopping, and
            services across Singapore
          </p>

          <div className="mx-auto mb-8 max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search for halal restaurants, cafes, services..."
                className="py-6 pl-12 pr-4 text-lg shadow-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" size="lg" className="absolute right-2 top-2">
                Search
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/listings">Browse Directory</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">List Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {mockCategories.map(category => (
              <Link
                key={category.id}
                to={`/listings?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 text-4xl">{category.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} businesses
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Listings */}
      <section className="bg-accent/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Featured Businesses</h2>
              <p className="text-muted-foreground">
                Premium listings from trusted halal businesses
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/listings?premium=true">View All</Link>
            </Button>
          </div>

          {premiumListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {premiumListings.map(listing => (
                <Link to={`/listings/${listing.slug}`} key={listing.id}>
                  <Card className="group transition-all duration-300 hover:shadow-lg">
                    <div className="relative">
                      <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <MapPin className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      <div className="absolute right-3 top-3">
                        <Crown className="h-5 w-5 text-warning" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-semibold">{listing.name}</h3>
                      {listing.rating && (
                        <div className="mb-2 flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">
                            {listing.rating.toFixed(1)}
                          </span>
                          {listing.review_count && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({listing.review_count})
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {listing.district || 'Singapore'}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No featured businesses at the moment. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
