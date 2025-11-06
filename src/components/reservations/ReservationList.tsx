import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReservationCard } from './ReservationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReservationListProps {
  userId?: string;
  businessId?: string;
}

export const ReservationList = ({ userId, businessId }: ReservationListProps) => {
  const { data: reservations, isLoading, error } = useQuery({
    queryKey: ['reservations', userId, businessId],
    enabled: !!userId || !!businessId,
    queryFn: async () => {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          businesses:business_id (name, slug, address, phone)
        `)
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load reservations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  const upcomingReservations = reservations?.filter(
    (r) =>
      ['pending', 'confirmed'].includes(r.status) &&
      new Date(r.reservation_date) >= new Date()
  ) || [];

  const pastReservations = reservations?.filter(
    (r) =>
      !['pending', 'confirmed'].includes(r.status) ||
      new Date(r.reservation_date) < new Date()
  ) || [];

  if (reservations?.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No reservations yet
        </h3>
        <p className="text-gray-500">
          Your reservations will appear here once you book a table.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingReservations.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastReservations.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-6">
        {upcomingReservations.length > 0 ? (
          <div className="space-y-4">
            {upcomingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                businessName={reservation.businesses?.name}
                businessAddress={reservation.businesses?.address}
                businessPhone={reservation.businesses?.phone}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming reservations
          </div>
        )}
      </TabsContent>

      <TabsContent value="past" className="mt-6">
        {pastReservations.length > 0 ? (
          <div className="space-y-4">
            {pastReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                businessName={reservation.businesses?.name}
                businessAddress={reservation.businesses?.address}
                businessPhone={reservation.businesses?.phone}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No past reservations
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
