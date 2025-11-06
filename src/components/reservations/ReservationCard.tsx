import { useState } from 'react';
import { useMutation, useQueryClient } from '@tantml:parameter>
<invoke name="supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  X,
  Check,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { format, parse } from 'date-fns';

interface Reservation {
  id: string;
  business_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string | null;
  dietary_restrictions: string | null;
  occasion: string | null;
  seating_preference: string | null;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';
  confirmation_code: string;
  deposit_amount: number;
  booking_fee: number;
  created_at: string;
}

interface ReservationCardProps {
  reservation: Reservation;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  showActions?: boolean;
  onCancel?: (reservationId: string) => void;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: Check },
  seated: { label: 'Seated', color: 'bg-blue-100 text-blue-800', icon: Users },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: Check },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: X },
  no_show: { label: 'No Show', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export const ReservationCard = ({
  reservation,
  businessName,
  businessAddress,
  businessPhone,
  showActions = true,
  onCancel,
}: ReservationCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const statusInfo = statusConfig[reservation.status];
  const StatusIcon = statusInfo.icon;

  const cancelReservationMutation = useMutation({
    mutationFn: async (reason: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          cancelled_by: user.id,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', reservation.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Reservation cancelled',
        description: 'Your reservation has been cancelled successfully.',
      });
      setShowCancelDialog(false);
      setCancellationReason('');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });

      if (onCancel) {
        onCancel(reservation.id);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Cancellation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCopyConfirmationCode = () => {
    navigator.clipboard.writeText(reservation.confirmation_code);
    toast({
      title: 'Copied!',
      description: 'Confirmation code copied to clipboard',
    });
  };

  const handleCancelReservation = () => {
    cancelReservationMutation.mutate(cancellationReason);
  };

  const canCancel = ['pending', 'confirmed'].includes(reservation.status);

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              {businessName && (
                <h3 className="text-xl font-semibold mb-1">{businessName}</h3>
              )}
              <div className="flex items-center gap-2">
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <button
                  onClick={handleCopyConfirmationCode}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <span className="font-mono">{reservation.confirmation_code}</span>
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(new Date(reservation.reservation_date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {format(
                      parse(reservation.reservation_time, 'HH:mm:ss', new Date()),
                      'h:mm a'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Party Size</p>
                  <p className="font-medium">
                    {reservation.party_size} {reservation.party_size === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {businessAddress && (
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{businessAddress}</p>
                  </div>
                </div>
              )}

              {businessPhone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{businessPhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Confirmation Email</p>
                  <p className="font-medium text-sm">{reservation.customer_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(reservation.occasion ||
            reservation.seating_preference ||
            reservation.dietary_restrictions ||
            reservation.special_requests) && (
            <div className="pt-4 border-t space-y-2">
              {reservation.occasion && (
                <div>
                  <span className="text-sm text-gray-500">Occasion: </span>
                  <span className="text-sm font-medium capitalize">
                    {reservation.occasion}
                  </span>
                </div>
              )}
              {reservation.seating_preference && (
                <div>
                  <span className="text-sm text-gray-500">Seating: </span>
                  <span className="text-sm font-medium capitalize">
                    {reservation.seating_preference}
                  </span>
                </div>
              )}
              {reservation.dietary_restrictions && (
                <div>
                  <span className="text-sm text-gray-500">Dietary: </span>
                  <span className="text-sm">{reservation.dietary_restrictions}</span>
                </div>
              )}
              {reservation.special_requests && (
                <div>
                  <span className="text-sm text-gray-500">Special Requests: </span>
                  <span className="text-sm">{reservation.special_requests}</span>
                </div>
              )}
            </div>
          )}

          {/* Fees */}
          {(reservation.booking_fee > 0 || reservation.deposit_amount > 0) && (
            <div className="pt-4 border-t">
              {reservation.booking_fee > 0 && (
                <p className="text-sm text-gray-600">
                  Booking Fee: ${reservation.booking_fee.toFixed(2)}
                </p>
              )}
              {reservation.deposit_amount > 0 && (
                <p className="text-sm text-gray-600">
                  Deposit: ${reservation.deposit_amount.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && canCancel && (
            <div className="pt-4 border-t flex gap-3">
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Reservation
              </Button>
            </div>
          )}

          {/* Booking Date */}
          <p className="text-xs text-gray-500 pt-2">
            Booked on {format(new Date(reservation.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason for cancellation (optional)
              </label>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Let us know why you're cancelling..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelReservationMutation.isPending}
            >
              Keep Reservation
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelReservation}
              disabled={cancelReservationMutation.isPending}
            >
              {cancelReservationMutation.isPending && 'Cancelling...'}
              {!cancelReservationMutation.isPending && 'Cancel Reservation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
