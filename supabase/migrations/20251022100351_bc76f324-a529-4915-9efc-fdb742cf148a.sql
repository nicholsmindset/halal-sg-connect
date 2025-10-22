-- Create SEO pages table for programmatic content
CREATE TABLE IF NOT EXISTS public.seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  page_type TEXT NOT NULL, -- 'district', 'district_category', 'property_zone', 'property_zone_category', 'category', 'feature', 'price', 'location', 'combination'
  title TEXT NOT NULL,
  h1_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  schema_markup JSONB,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create businesses table for halal business listings
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  district TEXT,
  planning_area TEXT,
  property_district_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  price_range TEXT,
  halal_certified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  categories TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  category_slugs TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create business_search_view for efficient queries
CREATE OR REPLACE VIEW public.business_search_view AS
SELECT 
  b.*
FROM public.businesses b
WHERE b.verification_status = 'verified';

-- Enable RLS on both tables
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS policies for seo_pages (public read access)
CREATE POLICY "SEO pages are publicly readable"
ON public.seo_pages
FOR SELECT
TO public
USING (is_published = true);

-- RLS policies for businesses (public read access for verified businesses)
CREATE POLICY "Verified businesses are publicly readable"
ON public.businesses
FOR SELECT
TO public
USING (verification_status = 'verified');

-- Authenticated users can insert businesses
CREATE POLICY "Authenticated users can create businesses"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON public.seo_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_page_type ON public.seo_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_district ON public.businesses(district);
CREATE INDEX IF NOT EXISTS idx_businesses_planning_area ON public.businesses(planning_area);
CREATE INDEX IF NOT EXISTS idx_businesses_property_district_code ON public.businesses(property_district_code);
CREATE INDEX IF NOT EXISTS idx_businesses_verification_status ON public.businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_categories ON public.businesses USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_businesses_category_slugs ON public.businesses USING GIN(category_slugs);

-- Insert sample SEO page for Clementi district
INSERT INTO public.seo_pages (slug, page_type, title, h1_title, meta_description, canonical_url, filters, content)
VALUES (
  'clementi',
  'district',
  'Halal Restaurants & Businesses in Clementi, Singapore',
  'Halal Dining & Services in Clementi',
  'Discover the best halal restaurants, cafes, and businesses in Clementi, Singapore. From authentic Muslim-friendly dining to local services.',
  '/district/clementi',
  '{"planning_area": "clementi"}',
  '{
    "intro_text": "Clementi is a vibrant residential town in western Singapore, known for its diverse dining scene and family-friendly atmosphere. Discover halal-certified restaurants, cafes, and local businesses.",
    "business_stats": {
      "total_count": 15,
      "avg_rating": 4.2,
      "popular_cuisines": ["Malay", "Chinese", "Western", "Indian"],
      "top_features": ["Family-Friendly", "Halal Certified", "Air-Conditioned", "WiFi Available"]
    },
    "highlights": [
      "Home to popular hawker centres and food courts",
      "Well-connected by MRT and bus services",
      "Mix of traditional and modern dining options",
      "Growing Muslim-friendly business community"
    ],
    "local_info": "Clementi is a major residential town in western Singapore, featuring modern amenities, excellent transport links, and a thriving food scene. The area is popular among families and students due to its proximity to educational institutions and affordable dining options."
  }'
);