import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { mockCategories, mockDistricts } from '@/lib/mockData';
import { Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  subcategory: z.string().optional(),
  district: z.string().min(1, 'Please select a district'),
  address: z.string().min(5, 'Please enter a valid address'),
  phone: z.string().optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  priceRange: z.string().min(1, 'Please select a price range'),
  isHalalCertified: z.boolean(),
  features: z.array(z.string()),
  tags: z.array(z.string()),
  openingHours: z.object({
    monday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    tuesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    wednesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    thursday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    friday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
  }),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const availableFeatures = [
  'family-friendly',
  'takeaway',
  'dine-in',
  'delivery',
  'catering',
  'air-conditioned',
  'wifi',
  'parking',
  'wheelchair-accessible',
  'outdoor-seating',
];

const availableTags = [
  'halal',
  'vegetarian',
  'spicy',
  'traditional',
  'modern',
  'budget-friendly',
  'premium',
  'quick-bite',
  'fine-dining',
  'casual',
];

const priceRanges = ['$', '$$', '$$$', '$$$$'];

interface ListingFormProps {
  listingId?: string;
  onSave?: (data: BusinessFormData) => void;
}

const ListingForm = ({ listingId, onSave }: ListingFormProps) => {
  const navigate = useNavigate();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      subcategory: '',
      district: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      priceRange: '$$',
      isHalalCertified: false,
      features: [],
      tags: [],
      openingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '09:00', close: '21:00' },
      },
      socialMedia: {
        instagram: '',
        facebook: '',
        tiktok: '',
      },
    },
  });

  const onSubmit = async (data: BusinessFormData) => {
    setIsSaving(true);
    try {
      const formData = {
        ...data,
        features: selectedFeatures,
        tags: selectedTags,
      };

      if (onSave) {
        onSave(formData);
        setIsSaving(false);
        return;
      }

      // Create slug from business name
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Prepare business data for Supabase
      const businessData = {
        name: data.name,
        slug: listingId ? '' : slug, // Empty string for updates, slug for new listings
        description: data.description,
        address: data.address,
        district: data.district,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        price_range: data.priceRange.toLowerCase().includes('$$$')
          ? 'premium'
          : data.priceRange.toLowerCase().includes('$$')
            ? 'mid-range'
            : 'budget',
        halal_certified: data.isHalalCertified,
        category_slugs: [data.category],
        features: selectedFeatures,
        operating_hours: data.openingHours,
        images: uploadedImages.length > 0 ? uploadedImages : null,
        is_active: true,
        is_premium: false,
      };

      if (listingId) {
        // Update existing listing
        const { error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', listingId);

        if (error) throw error;
        toast.success('Listing updated successfully!');
      } else {
        // Create new listing
        const { error } = await supabase
          .from('businesses')
          .insert([businessData]);

        if (error) throw error;
        toast.success('Listing created successfully!');
      }

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save listing. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `business-images/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('business-assets').getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {listingId ? 'Edit Listing' : 'Create New Listing'}
        </h1>
        <p className="text-muted-foreground">
          {listingId
            ? 'Update your business information'
            : 'Add your business to the directory'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="hours">Hours & Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business, specialties, and what makes it unique"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockCategories.map(category => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.icon} {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Range *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select price range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priceRanges.map(range => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isHalalCertified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Halal Certified
                          </FormLabel>
                          <FormDescription>
                            Is your business halal certified?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Location & Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockDistricts
                              .filter(d => d !== 'All Districts')
                              .map(district => (
                                <SelectItem key={district} value={district}>
                                  {district}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter complete address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label className="text-base font-medium">Features</Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Select features that apply to your business
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                      {availableFeatures.map(feature => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={feature}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <Label
                            htmlFor={feature}
                            className="text-sm capitalize"
                          >
                            {feature.replace('-', ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Tags</Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Add tags to help customers find your business
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? 'default' : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Images & Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Business Images
                    </Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Upload high-quality images of your business, food, or
                      products
                    </p>

                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center">
                      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Click to upload images
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Support for JPG, PNG files up to 5MB each
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="group relative">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="h-24 w-full rounded-lg object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hours" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(form.getValues('openingHours')).map(
                    ([day]) => (
                      <div
                        key={day}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <Label className="font-medium capitalize">{day}</Label>
                        <FormField
                          control={form.control}
                          name={`openingHours.${day as keyof BusinessFormData['openingHours']}.open`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`openingHours.${day as keyof BusinessFormData['openingHours']}.close`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`openingHours.${day as keyof BusinessFormData['openingHours']}.closed`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                  />
                                  <Label className="text-sm">Closed</Label>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+65 XXXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="contact@business.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.business.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Social Media
                    </Label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="socialMedia.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="Page URL" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.tiktok"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TikTok</FormLabel>
                            <FormControl>
                              <Input placeholder="@username" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? 'Saving...'
                  : listingId
                    ? 'Update Listing'
                    : 'Create Listing'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ListingForm;
