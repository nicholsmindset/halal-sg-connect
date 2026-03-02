import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingGallery from '@/components/ListingGallery';
import ListingInfo from '@/components/ListingInfo';
import { ReviewForm, ReviewList } from '@/components/reviews';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ListingDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug');
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const isBusinessOwner = listing && currentUser ? (listing as any).owner_id === currentUser.id : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading listing...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Listing not found</h2>
            <p className="text-muted-foreground mb-4">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/listings')}>
              Browse All Listings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ListingGallery images={listing.images} />
        <ListingInfo listing={listing} />

        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="write" disabled={!currentUser}>
                <Edit className="h-4 w-4 mr-2" />
                Write Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <ReviewList
                businessId={listing.id}
                currentUserId={currentUser?.id}
                isBusinessOwner={isBusinessOwner}
              />
            </TabsContent>

            <TabsContent value="write" className="mt-6">
              {currentUser ? (
                <ReviewForm
                  businessId={listing.id}
                  businessName={listing.name}
                  onSuccess={() => {
                    const reviewsTab = document.querySelector('[value="reviews"]') as HTMLElement;
                    if (reviewsTab) reviewsTab.click();
                  }}
                />
              ) : (
                <div className="text-center py-8 bg-card rounded-lg border">
                  <p className="text-muted-foreground mb-4">
                    You must be logged in to write a review
                  </p>
                  <Button onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetails;
