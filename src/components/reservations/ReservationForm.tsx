import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, Calendar as CalendarIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { format, addDays, parse, isBefore, startOfDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';

const reservationFormSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  time: z.string().min(1, 'Please select a time'),
  partySize: z.number().min(1, 'Party size must be at least 1').max(50, 'Party size too large'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(8, 'Phone number must be at least 8 digits'),
  specialRequests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  occasion: z.string().optional(),
  seatingPreference: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ReservationFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: (confirmationCode: string) => void;
  onCancel?: () => void;
}

export const ReservationForm = ({
  businessId,
  businessName,
  onSuccess,
  onCancel,
}: ReservationFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reservation settings
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['reservation-settings', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservation_settings')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_enabled', true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch available time slots for selected date
  const { data: timeSlots, isLoading: loadingSlots } = useQuery({
    queryKey: ['time-slots', businessId, selectedDate],
    enabled: !!selectedDate,
    queryFn: async () => {
      if (!selectedDate) return [];

      const { data, error } = await supabase
        .from('reservation_time_slots')
        .select('*')
        .eq('business_id', businessId)
        .eq('slot_date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('is_available', true)
        .order('slot_time');

      if (error) throw error;
      return data || [];
    },
  });

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      partySize: 2,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      specialRequests: '',
      dietaryRestrictions: '',
      occasion: '',
      seatingPreference: '',
    },
  });

  // Auto-fill user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        form.setValue('customerEmail', user.email || '');
        // In real app, fetch user profile for name and phone
      }
    };
    fetchUserData();
  }, [form]);

  const createReservationMutation = useMutation({
    mutationFn: async (data: ReservationFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to make a reservation');
      }

      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert({
          business_id: businessId,
          user_id: user.id,
          reservation_date: format(data.date, 'yyyy-MM-dd'),
          reservation_time: data.time,
          party_size: data.partySize,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
          special_requests: data.specialRequests || null,
          dietary_restrictions: data.dietaryRestrictions || null,
          occasion: data.occasion || null,
          seating_preference: data.seatingPreference || null,
          status: settings?.require_approval ? 'pending' : 'confirmed',
          booking_fee: settings?.booking_fee || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return reservation;
    },
    onSuccess: (reservation) => {
      toast({
        title: 'Reservation created!',
        description: `Your confirmation code is ${reservation.confirmation_code}`,
      });

      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['time-slots', businessId] });

      form.reset();
      setSelectedDate(undefined);

      if (onSuccess) {
        onSuccess(reservation.confirmation_code);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Reservation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    createReservationMutation.mutate(data);
  };

  if (loadingSettings) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Reservations are not available for this business.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  const minDate = addDays(new Date(), Math.ceil(settings.min_advance_hours / 24));
  const maxDate = addDays(new Date(), settings.advance_booking_days);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">
          Reserve a Table at {businessName}
        </h3>
        <p className="text-gray-600">
          Book your table in just a few steps. We'll send you a confirmation immediately.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Date Selection */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && 'text-muted-foreground'
                        }`}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setSelectedDate(date);
                      }}
                      disabled={(date) =>
                        isBefore(startOfDay(date), startOfDay(minDate)) ||
                        date > maxDate
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Book up to {settings.advance_booking_days} days in advance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Selection */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time *</FormLabel>
                <Select
                  disabled={!selectedDate || loadingSlots}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time">
                        {field.value && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(parse(field.value, 'HH:mm:ss', new Date()), 'h:mm a')}
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingSlots ? (
                      <div className="p-4 text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      </div>
                    ) : timeSlots && timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.slot_time}>
                          <div className="flex items-center justify-between gap-4">
                            <span>
                              {format(parse(slot.slot_time, 'HH:mm:ss', new Date()), 'h:mm a')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {slot.available_capacity} spots left
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No available time slots for this date
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Party Size */}
          <FormField
            control={form.control}
            name="partySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party Size *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {field.value} {field.value === 1 ? 'person' : 'people'}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(
                      { length: settings.max_party_size - settings.min_party_size + 1 },
                      (_, i) => i + settings.min_party_size
                    ).map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Information */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Contact Information</h4>

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send your confirmation here
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+65 1234 5678" {...field} />
                  </FormControl>
                  <FormDescription>
                    In case we need to reach you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold">Additional Details (Optional)</h4>

            <FormField
              control={form.control}
              name="occasion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occasion</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an occasion" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="business">Business Meeting</SelectItem>
                      <SelectItem value="date">Date Night</SelectItem>
                      <SelectItem value="casual">Casual Dining</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seatingPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seating Preference</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select seating preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="window">Window Seat</SelectItem>
                      <SelectItem value="private">Private Room</SelectItem>
                      <SelectItem value="bar">Bar Area</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Vegetarian, Nut allergy, Gluten-free"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or notes for the restaurant..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Booking Fee Info */}
          {settings.booking_fee > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A booking fee of ${settings.booking_fee.toFixed(2)} will be charged.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={createReservationMutation.isPending}
              className="flex-1"
            >
              {createReservationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {settings.require_approval ? 'Request Reservation' : 'Confirm Reservation'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={createReservationMutation.isPending}
              >
                Cancel
              </Button>
            )}
          </div>

          {/* Terms */}
          {settings.terms_and_conditions && (
            <p className="text-xs text-gray-500">
              By making a reservation, you agree to the restaurant's{' '}
              <button type="button" className="underline">
                terms and conditions
              </button>
              .
            </p>
          )}
        </form>
      </Form>
    </Card>
  );
};
