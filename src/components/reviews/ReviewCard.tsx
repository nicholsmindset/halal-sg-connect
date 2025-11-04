import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string;
  photos: string[] | null;
  helpful_count: number;
  not_helpful_count: number;
  verified_purchase: boolean;
  visit_date: string | null;
  business_response: string | null;
  business_response_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  isBusinessOwner?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export const ReviewCard = ({
  review,
  currentUserId,
  isBusinessOwner,
  onEdit,
  onDelete,
  onReport,
}: ReviewCardProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isOwnReview = currentUserId === review.user_id;

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: "helpful" | "not_helpful" }) => {
      if (!currentUserId) {
        throw new Error("You must be logged in to vote");
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("review_votes")
        .select("*")
        .eq("review_id", review.id)
        .eq("user_id", currentUserId)
        .single();

      if (existingVote) {
        // Update existing vote
        if (existingVote.vote_type === voteType) {
          // Remove vote if clicking same button
          await supabase
            .from("review_votes")
            .delete()
            .eq("id", existingVote.id);
        } else {
          // Change vote type
          await supabase
            .from("review_votes")
            .update({ vote_type: voteType })
            .eq("id", existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from("review_votes").insert({
          review_id: review.id,
          user_id: currentUserId,
          vote_type: voteType,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", review.business_id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Business response mutation
  const respondMutation = useMutation({
    mutationFn: async (response: string) => {
      if (!currentUserId) {
        throw new Error("You must be logged in to respond");
      }

      const { error } = await supabase
        .from("reviews")
        .update({
          business_response: response,
          business_response_at: new Date().toISOString(),
          business_responder_id: currentUserId,
        })
        .eq("id", review.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Response posted",
        description: "Your response has been posted successfully.",
      });
      setShowResponseForm(false);
      setResponseText("");
      queryClient.invalidateQueries({ queryKey: ["reviews", review.business_id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: "helpful" | "not_helpful") => {
    voteMutation.mutate({ voteType });
  };

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      respondMutation.mutate(responseText);
    }
  };

  const getUserInitials = (userId: string) => {
    // In a real app, you'd fetch user data. For now, use placeholder
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={`https://avatar.vercel.sh/${review.user_id}`} />
              <AvatarFallback>{getUserInitials(review.user_id)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Anonymous User</h4>
                {review.verified_purchase && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {/* Actions Menu */}
          {(isOwnReview || isBusinessOwner) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnReview && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(review.id)}>
                    Edit Review
                  </DropdownMenuItem>
                )}
                {isOwnReview && onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(review.id)}
                    className="text-red-600"
                  >
                    Delete Review
                  </DropdownMenuItem>
                )}
                {!isOwnReview && onReport && (
                  <DropdownMenuItem onClick={() => onReport(review.id)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report Review
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Rating */}
        <Rating value={review.rating} readonly size="md" />

        {/* Title */}
        {review.title && (
          <h5 className="font-semibold text-lg">{review.title}</h5>
        )}

        {/* Content */}
        <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>

        {/* Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {review.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Review photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        )}

        {/* Visit Date */}
        {review.visit_date && (
          <p className="text-sm text-gray-500">
            Visited on {new Date(review.visit_date).toLocaleDateString()}
          </p>
        )}

        {/* Voting */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <span className="text-sm text-gray-600">Was this review helpful?</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("helpful")}
              disabled={!currentUserId || voteMutation.isPending}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {review.helpful_count}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote("not_helpful")}
              disabled={!currentUserId || voteMutation.isPending}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {review.not_helpful_count}
            </Button>
          </div>
        </div>

        {/* Business Response */}
        {review.business_response && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-blue-900 mb-1">
                  Response from Business Owner
                </p>
                <p className="text-sm text-gray-700">{review.business_response}</p>
                {review.business_response_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Responded{" "}
                    {formatDistanceToNow(new Date(review.business_response_at), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Response Form */}
        {isBusinessOwner && !review.business_response && (
          <>
            {!showResponseForm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResponseForm(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Respond to Review
              </Button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Thank the reviewer and address their feedback..."
                  className="w-full p-3 border rounded-lg min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || respondMutation.isPending}
                    size="sm"
                  >
                    Post Response
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResponseForm(false);
                      setResponseText("");
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Review photo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </Card>
  );
};
