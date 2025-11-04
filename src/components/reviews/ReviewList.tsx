import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReviewCard } from "./ReviewCard";
import { RatingDistribution } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Star } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewListProps {
  businessId: string;
  currentUserId?: string;
  isBusinessOwner?: boolean;
}

type SortOption = "recent" | "helpful" | "rating_high" | "rating_low";
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1" | "with_photos";

const REVIEWS_PER_PAGE = 10;

export const ReviewList = ({
  businessId,
  currentUserId,
  isBusinessOwner,
}: ReviewListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [page, setPage] = useState(1);

  // Fetch review statistics
  const { data: statistics } = useQuery({
    queryKey: ["review-statistics", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_statistics")
        .select("*")
        .eq("business_id", businessId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch reviews
  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ["reviews", businessId, sortBy, filterBy, page],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("business_id", businessId)
        .eq("status", "approved");

      // Apply filters
      if (filterBy !== "all" && filterBy !== "with_photos") {
        query = query.eq("rating", parseInt(filterBy));
      }

      if (filterBy === "with_photos") {
        query = query.not("photos", "is", null);
      }

      // Apply sorting
      switch (sortBy) {
        case "helpful":
          query = query.order("helpful_count", { ascending: false });
          break;
        case "rating_high":
          query = query.order("rating", { ascending: false });
          break;
        case "rating_low":
          query = query.order("rating", { ascending: true });
          break;
        case "recent":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Pagination
      const from = (page - 1) * REVIEWS_PER_PAGE;
      const to = from + REVIEWS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        reviews: data || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / REVIEWS_PER_PAGE),
      };
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load reviews. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.total || 0;
  const totalPages = reviewsData?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Review Statistics Summary */}
      {statistics && statistics.total_reviews > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Overall Rating</h3>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">
                {statistics.average_rating.toFixed(1)}
              </span>
              <span className="text-gray-500 mb-2">out of 5</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(statistics.average_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Based on {statistics.total_reviews.toLocaleString()} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Rating Distribution</h3>
            <RatingDistribution statistics={statistics} />
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="rating_high">Highest Rating</SelectItem>
              <SelectItem value="rating_low">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="with_photos">With Photos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {statistics && (
          <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
            {statistics.verified_reviews_count > 0 && (
              <span>
                {statistics.verified_reviews_count} verified
              </span>
            )}
            {statistics.reviews_with_photos_count > 0 && (
              <span>
                {statistics.reviews_with_photos_count} with photos
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              isBusinessOwner={isBusinessOwner}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;

              // Show first page, last page, current page, and pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              } else if (pageNum === page - 2 || pageNum === page + 2) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Info */}
      {totalReviews > 0 && (
        <p className="text-center text-sm text-gray-500">
          Showing {((page - 1) * REVIEWS_PER_PAGE) + 1}-
          {Math.min(page * REVIEWS_PER_PAGE, totalReviews)} of{" "}
          {totalReviews.toLocaleString()} reviews
        </p>
      )}
    </div>
  );
};
