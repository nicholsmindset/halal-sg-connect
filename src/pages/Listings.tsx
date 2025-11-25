import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ListingCard from '@/components/ListingCard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  // Fetch businesses from Supabase
  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ['businesses', searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('verification_status', 'approved') // Only show approved businesses
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`
        );
      }

      // Apply category filter
      if (categoryFilter) {
        query = query.contains('category_slugs', [categoryFilter.toLowerCase()]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Halal Businesses Directory
          </h1>
          <p className="text-muted-foreground">
            Discover authentic halal businesses across Singapore
            {searchQuery && (
              <span className="ml-2 font-medium text-foreground">
                - Search results for "{searchQuery}"
              </span>
            )}
          </p>
        </div>

        <SearchFilters />

        {isLoading ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading businesses...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-2">Failed to load businesses</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please try again later'}
              </p>
            </CardContent>
          </Card>
        ) : businesses && businesses.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium mb-2">No businesses found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No businesses available at the moment.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
