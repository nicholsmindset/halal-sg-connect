import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/ui/rating';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  Flag,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending reviews
  const { data: pendingReviews, isLoading: loadingPending } = useQuery({
    queryKey: ['admin-reviews', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews' as any)
        .select(`
          *,
          businesses:business_id (name, slug)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  // Fetch flagged reviews
  const { data: flaggedReviews, isLoading: loadingFlagged } = useQuery({
    queryKey: ['admin-reviews', 'flagged'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews' as any)
        .select(`
          *,
          businesses:business_id (name, slug)
        `)
        .eq('status', 'flagged')
        .order('flag_count', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  // Fetch review flags
  const { data: flags } = useQuery({
    queryKey: ['admin-review-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_flags' as any)
        .select(`
          *,
          reviews:review_id (
            id,
            content,
            rating,
            businesses:business_id (name)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  // Moderate review mutation
  const moderateMutation = useMutation({
    mutationFn: async ({
      reviewId,
      status,
      note,
    }: {
      reviewId: string;
      status: 'approved' | 'rejected' | 'hidden';
      note?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reviews' as any)
        .update({
          status,
          moderation_notes: note || null,
          moderated_by: user.id,
          moderated_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Review moderated',
        description: 'Review status has been updated successfully.',
      });
      setSelectedReview(null);
      setModerationNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle flag mutation
  const handleFlagMutation = useMutation({
    mutationFn: async ({
      flagId,
      status,
    }: {
      flagId: string;
      status: 'reviewed' | 'resolved' | 'dismissed';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('review_flags' as any)
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', flagId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Flag processed',
        description: 'Flag has been processed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-review-flags'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const ReviewItem = ({ review }: { review: any }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">
                  {review.businesses?.name || 'Unknown Business'}
                </h4>
                {review.flag_count > 0 && (
                  <Badge variant="destructive">
                    <Flag className="h-3 w-3 mr-1" />
                    {review.flag_count} flags
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                User ID: {review.user_id?.slice(0, 8)}... •{' '}
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <Rating value={review.rating} readonly size="sm" />
          </div>

          {review.title && (
            <h5 className="font-semibold text-lg">{review.title}</h5>
          )}

          <p className="text-muted-foreground whitespace-pre-wrap">{review.content}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {review.photos.map((photo: string, idx: number) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Review photo ${idx + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => moderateMutation.mutate({
                reviewId: review.id,
                status: 'approved',
              })}
              disabled={moderateMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setSelectedReview(review.id)}
              disabled={moderateMutation.isPending}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMutation.mutate({
                reviewId: review.id,
                status: 'hidden',
              })}
              disabled={moderateMutation.isPending}
            >
              <Eye className="h-4 w-4 mr-2" />
              Hide
            </Button>
          </div>

          {selectedReview === review.id && (
            <div className="space-y-2 mt-4 p-4 bg-muted rounded-lg">
              <label className="text-sm font-medium">Moderation Note</label>
              <Textarea
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                placeholder="Reason for rejection..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => moderateMutation.mutate({
                    reviewId: review.id,
                    status: 'rejected',
                    note: moderationNote,
                  })}
                >
                  Confirm Rejection
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedReview(null);
                    setModerationNote('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const FlagItem = ({ flag }: { flag: any }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{flag.reason}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(flag.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm font-semibold">
                Business: {flag.reviews?.businesses?.name || 'Unknown'}
              </p>
            </div>
          </div>

          {flag.details && (
            <p className="text-sm text-muted-foreground">
              <strong>Details:</strong> {flag.details}
            </p>
          )}

          <div className="bg-muted p-3 rounded">
            <p className="text-sm text-muted-foreground">{flag.reviews?.content}</p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleFlagMutation.mutate({
                flagId: flag.id,
                status: 'resolved',
              })}
            >
              Resolve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFlagMutation.mutate({
                flagId: flag.id,
                status: 'dismissed',
              })}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout
      title="Content Moderation"
      description="Review and moderate user-generated content"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingReviews?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {flaggedReviews?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {flags?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">User reports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Reviews ({pendingReviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged Reviews ({flaggedReviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="flags">
            User Flags ({flags?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {loadingPending ? (
            <p>Loading...</p>
          ) : pendingReviews && pendingReviews.length > 0 ? (
            pendingReviews.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No pending reviews
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          {loadingFlagged ? (
            <p>Loading...</p>
          ) : flaggedReviews && flaggedReviews.length > 0 ? (
            flaggedReviews.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No flagged reviews
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          {flags && flags.length > 0 ? (
            flags.map((flag: any) => <FlagItem key={flag.id} flag={flag} />)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No pending flags
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminModeration;
