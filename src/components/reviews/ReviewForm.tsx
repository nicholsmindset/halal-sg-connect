import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, X, Camera } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_PHOTOS = 10;

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(5000, "Review must not exceed 5000 characters"),
  visitDate: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  businessId: string;
  businessName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({
  businessId,
  businessName,
  onSuccess,
  onCancel,
}: ReviewFormProps) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
      visitDate: "",
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to submit a review");
      }

      // Upload photos first
      const photoUrls: string[] = [];

      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const fileExt = photo.name.split(".").pop();
          const fileName = `${user.id}/${businessId}/${Date.now()}-${i}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("review-photos")
            .upload(fileName, photo);

          if (uploadError) {
            throw new Error(`Failed to upload photo: ${uploadError.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("review-photos").getPublicUrl(fileName);

          photoUrls.push(publicUrl);

          setUploadProgress(((i + 1) / photos.length) * 100);
        }
      }

      // Create review
      const { data: review, error: reviewError } = await supabase
        .from("reviews")
        .insert({
          business_id: businessId,
          user_id: user.id,
          rating: data.rating,
          title: data.title || null,
          content: data.content,
          photos: photoUrls.length > 0 ? photoUrls : null,
          visit_date: data.visitDate || null,
        })
        .select()
        .single();

      if (reviewError) {
        throw reviewError;
      }

      return review;
    },
    onSuccess: () => {
      toast({
        title: "Review submitted!",
        description: "Your review has been submitted and is pending approval.",
      });

      // Invalidate queries to refetch reviews
      queryClient.invalidateQueries({ queryKey: ["reviews", businessId] });
      queryClient.invalidateQueries({ queryKey: ["review-statistics", businessId] });

      // Reset form and photos
      form.reset();
      setPhotos([]);
      setPhotoPreviews([]);
      setUploadProgress(0);

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const validFiles = files.filter((file) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image type`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (photos.length + validFiles.length > MAX_PHOTOS) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${MAX_PHOTOS} photos`,
        variant: "destructive",
      });
      return;
    }

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setPhotos([...photos, ...validFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    // Revoke preview URL to free memory
    URL.revokeObjectURL(photoPreviews[index]);

    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ReviewFormValues) => {
    submitReviewMutation.mutate(data);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        Write a Review for {businessName}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating *</FormLabel>
                <FormControl>
                  <Rating
                    value={field.value}
                    onChange={field.onChange}
                    size="lg"
                    className="py-2"
                  />
                </FormControl>
                <FormDescription>
                  Click the stars to rate your experience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Sum up your experience in one line"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience... What did you order? How was the service? What made it special?"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value.length}/5000 characters (minimum 10)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Visit Date */}
          <FormField
            control={form.control}
            name="visitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Visit (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} max={new Date().toISOString().split('T')[0]} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Photo Upload */}
          <div className="space-y-4">
            <div>
              <FormLabel>Add Photos (Optional)</FormLabel>
              <FormDescription>
                Upload up to {MAX_PHOTOS} photos (max 5MB each)
              </FormDescription>
            </div>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {photos.length < MAX_PHOTOS && (
              <div>
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label htmlFor="photo-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or WebP (max 5MB)
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Upload Progress */}
            {submitReviewMutation.isPending && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading photos...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={submitReviewMutation.isPending}
              className="flex-1"
            >
              {submitReviewMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitReviewMutation.isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
};
