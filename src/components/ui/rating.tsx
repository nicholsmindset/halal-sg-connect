import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const Rating = ({
  value,
  onChange,
  size = "md",
  readonly = false,
  showValue = false,
  className,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= displayValue;
          const isHalfFilled = rating - 0.5 === displayValue;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "relative transition-colors",
                !readonly && "cursor-pointer hover:scale-110",
                readonly && "cursor-default"
              )}
              aria-label={`Rate ${rating} star${rating > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-all",
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200",
                  !readonly && "hover:fill-yellow-300 hover:text-yellow-300"
                )}
              />
              {isHalfFilled && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(
                      sizeClasses[size],
                      "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RatingDisplay = ({
  rating,
  reviewCount,
  size = "md",
  className,
}: RatingDisplayProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Rating value={rating} size={size} readonly showValue />
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
};

interface RatingDistributionProps {
  statistics: {
    rating_5_count: number;
    rating_4_count: number;
    rating_3_count: number;
    rating_2_count: number;
    rating_1_count: number;
    total_reviews: number;
  };
  className?: string;
}

export const RatingDistribution = ({
  statistics,
  className,
}: RatingDistributionProps) => {
  const { total_reviews } = statistics;

  const ratings = [
    { stars: 5, count: statistics.rating_5_count },
    { stars: 4, count: statistics.rating_4_count },
    { stars: 3, count: statistics.rating_3_count },
    { stars: 2, count: statistics.rating_2_count },
    { stars: 1, count: statistics.rating_1_count },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {ratings.map(({ stars, count }) => {
        const percentage =
          total_reviews > 0 ? (count / total_reviews) * 100 : 0;

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 w-6">
              {stars}
            </span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};
