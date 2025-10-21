import { z } from 'zod';

// Import Job Types
export interface ImportJob {
  id: string;
  filename: string;
  file_size?: number;
  file_type?: string;
  total_records: number;
  processed_records: number;
  successful_imports: number;
  failed_imports: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error_log: string[];
  import_type: 'csv' | 'json' | 'api' | 'manual';
  imported_by?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Business Import Schema for Validation
export const businessImportSchema = z.object({
  // Core Business Info
  name: z.string().min(2, 'Business name must be at least 2 characters').max(200),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  
  // Location Info
  address: z.string().min(5, 'Address must be at least 5 characters'),
  postal_code: z.string().regex(/^\d{6}$/, 'Invalid Singapore postal code').optional(),
  district: z.string().min(1, 'District is required'),
  coordinates: z.object({
    lat: z.number().min(1.0).max(1.5), // Singapore bounds
    lng: z.number().min(103.0).max(104.5)
  }).optional(),
  
  // Contact Info
  phone: z.string().regex(/^[+]?[0-9\s\-()]{8,15}$/, 'Invalid phone number format').optional(),
  email: z.string().email('Invalid email format').optional(),
  website: z.string().url('Invalid website URL').optional(),
  
  // Halal Certification
  halal_certified: z.boolean().default(false),
  certification_body: z.string().optional(),
  certification_number: z.string().optional(),
  
  // Business Details
  price_range: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  price_level: z.number().int().min(1).max(4).optional(),
  opening_hours: z.record(z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/, 'Time format should be HH:MM'),
    close: z.string().regex(/^\d{2}:\d{2}$/, 'Time format should be HH:MM'),
    closed: z.boolean().optional()
  })).optional(),
  
  // Features and Tags
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  cuisine_types: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  special_diets: z.array(z.string()).default([]),
  payment_methods: z.array(z.string()).default([]),
  delivery_platforms: z.array(z.string()).default([]),
  
  // Media
  images: z.array(z.string().url()).default([]),
  
  // Social Media
  facebook_id: z.string().optional(),
  instagram_handle: z.string().optional(),
  google_place_id: z.string().optional(),
  
  // Import Metadata
  source: z.string().default('csv'),
  external_id: z.string().optional(),
  
  // Business Rating (if available from source)
  rating: z.number().min(0).max(5).optional(),
  review_count: z.number().int().min(0).optional()
});

export type BusinessImportData = z.infer<typeof businessImportSchema>;

// CSV Header Mapping for flexible imports
export const csvHeaderMapping = {
  // Core fields - multiple possible headers
  name: ['name', 'business_name', 'company_name', 'restaurant_name', 'shop_name'],
  description: ['description', 'about', 'details', 'info'],
  category: ['category', 'type', 'business_type', 'industry'],
  subcategory: ['subcategory', 'sub_category', 'cuisine', 'specialty'],
  
  // Location
  address: ['address', 'location', 'full_address', 'street_address'],
  postal_code: ['postal_code', 'postcode', 'zip', 'postal'],
  district: ['district', 'area', 'neighbourhood', 'region', 'zone'],
  
  // Contact
  phone: ['phone', 'telephone', 'mobile', 'contact', 'phone_number'],
  email: ['email', 'email_address', 'contact_email'],
  website: ['website', 'url', 'web', 'homepage', 'site'],
  
  // Halal
  halal_certified: ['halal_certified', 'halal', 'is_halal', 'certified', 'halal_cert'],
  certification_body: ['certification_body', 'certifier', 'cert_body', 'halal_body'],
  certification_number: ['certification_number', 'cert_number', 'halal_number', 'cert_id'],
  
  // Business details
  price_range: ['price_range', 'price', 'budget', 'cost'],
  rating: ['rating', 'stars', 'score'],
  review_count: ['review_count', 'reviews', 'review_number', 'total_reviews'],
  
  // Features
  features: ['features', 'amenities', 'facilities', 'services'],
  tags: ['tags', 'keywords', 'labels'],
  cuisine_types: ['cuisine_types', 'cuisine', 'food_type', 'cooking_style'],
  
  // Social
  facebook_id: ['facebook_id', 'facebook', 'fb_id', 'fb'],
  instagram_handle: ['instagram_handle', 'instagram', 'ig_handle', 'ig'],
  google_place_id: ['google_place_id', 'place_id', 'google_id']
};

// Import Statistics
export interface ImportStatistics {
  import_date: string;
  total_jobs: number;
  total_successful: number;
  total_failed: number;
  avg_duration_minutes: number;
}

// Duplicate Detection
export interface BusinessDuplicate {
  id: string;
  business_id_1: string;
  business_id_2: string;
  similarity_score: number;
  match_type: 'exact_name' | 'fuzzy_name' | 'address' | 'phone' | 'coordinates' | 'combined';
  confidence_level: 'low' | 'medium' | 'high' | 'exact';
  status: 'pending' | 'confirmed_duplicate' | 'not_duplicate' | 'merged';
  reviewed_by?: string;
  reviewed_at?: string;
  merge_target_id?: string;
  created_at: string;
  updated_at: string;
}

// SEO Page Types
export interface SEOPage {
  id: string;
  slug: string;
  page_type: 'category' | 'location' | 'combination' | 'feature' | 'price' | 'cuisine';
  title: string;
  meta_description?: string;
  h1_title?: string;
  content?: SEOPageContent;
  filters: Record<string, any>;
  business_count: number;
  view_count: number;
  last_content_update?: string;
  seo_score?: number;
  is_published: boolean;
  canonical_url?: string;
  schema_markup?: Record<string, any>;
  related_pages: string[];
  created_at: string;
  updated_at: string;
}

export interface SEOPageContent {
  intro_text: string;
  highlights: string[];
  local_info?: string;
  business_stats: {
    total_count: number;
    avg_rating: number;
    price_distribution: Record<string, number>;
    popular_cuisines: string[];
    top_features: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  related_searches: string[];
}

// District and Category Types
export interface District {
  id: string;
  name: string;
  slug: string;
  description?: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  postal_sectors: number[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  population?: number;
  business_count: number;
  seo_title?: string;
  seo_description?: string;
  landmarks: string[];
  transport_hubs: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  icon?: string;
  description?: string;
  business_count: number;
  seo_title?: string;
  seo_description?: string;
  keywords: string[];
  sort_order: number;
  is_active: boolean;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

// Import Validation Result
export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  data?: BusinessImportData;
  row_number?: number;
}

// Bulk Import Request
export interface BulkImportRequest {
  file: File;
  import_type: 'csv' | 'json';
  mapping?: Record<string, string>; // Custom field mapping
  options: {
    skip_duplicates: boolean;
    auto_geocode: boolean;
    validate_only: boolean;
    batch_size: number;
  };
}

// Import Progress
export interface ImportProgress {
  job_id: string;
  status: ImportJob['status'];
  progress_percentage: number;
  current_record: number;
  total_records: number;
  successful_imports: number;
  failed_imports: number;
  errors: string[];
  estimated_completion?: string;
}

// Geocoding Service Types
export interface GeocodeResult {
  success: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  formatted_address?: string;
  district?: string;
  postal_code?: string;
  error?: string;
}