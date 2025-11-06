import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingGallery from '@/components/ListingGallery';
import ListingInfo from '@/components/ListingInfo';
import { ReviewForm, ReviewList } from '@/components/reviews';
import { ReservationForm } from '@/components/reservations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Edit, Calendar } from 'lucide-react';
import { mockListings } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ListingDetails = () => {
  const { slug } = useParams();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // In real app, this would fetch from Supabase
  const listing = mockListings.find(l => l.slug === slug);

  // Check if user is business owner (simplified - in real app, check business_owners table)
  const isBusinessOwner = false;
  
  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Listing not found</p>
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

        {/* Reviews & Reservations Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="write" disabled={!currentUser}>
                <Edit className="h-4 w-4 mr-2" />
                Write Review
              </TabsTrigger>
              <TabsTrigger value="reserve">
                <Calendar className="h-4 w-4 mr-2" />
                Reserve
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
                    // Switch back to reviews tab after successful submission
                    const reviewsTab = document.querySelector('[value="reviews"]') as HTMLElement;
                    if (reviewsTab) reviewsTab.click();
                  }}
                />
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border">
                  <p className="text-gray-600 mb-4">
                    You must be logged in to write a review
                  </p>
                  <Button onClick={() => window.location.href = '/auth'}>
                    Sign In
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reserve" className="mt-6">
              <ReservationForm
                businessId={listing.id}
                businessName={listing.name}
                onSuccess={(confirmationCode) => {
                  // Could redirect to a confirmation page or show success message
                  console.log('Reservation confirmed:', confirmationCode);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetails;
