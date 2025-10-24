-- Fix Security Issues: Remove SECURITY DEFINER and protect contact information

-- 1. Drop existing policies that may conflict
DROP POLICY IF EXISTS "Business owners can view their own contact info" ON public.businesses;

-- 2. Drop existing business_search_view
DROP VIEW IF EXISTS public.business_search_view;

-- 3. Recreate view WITHOUT SECURITY DEFINER and WITHOUT sensitive contact fields
CREATE VIEW public.business_search_view AS
SELECT 
  id,
  name,
  slug,
  description,
  address,
  district,
  planning_area,
  property_district_code,
  -- Exclude: phone, email (sensitive contact info)
  website,
  price_range,
  verification_status,
  categories,
  features,
  category_slugs,
  images,
  halal_certified,
  rating,
  review_count,
  is_premium,
  latitude,
  longitude,
  created_at,
  updated_at
FROM public.businesses
WHERE verification_status = 'verified';

-- 4. Add comments documenting the security consideration
COMMENT ON VIEW public.business_search_view IS 'Public search view - excludes sensitive contact information (email, phone) for privacy protection';
COMMENT ON COLUMN public.businesses.email IS 'SENSITIVE: Contact information protected - only accessible to business owners';
COMMENT ON COLUMN public.businesses.phone IS 'SENSITIVE: Contact information protected - only accessible to business owners';