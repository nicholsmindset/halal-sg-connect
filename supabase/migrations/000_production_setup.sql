-- Production Database Setup for Halal SG Connect
-- This script sets up all necessary tables, policies, and initial data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- CORE BUSINESS TABLES
-- =====================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL UNIQUE,
  description text,
  icon varchar(50),
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Districts table for Singapore locations
CREATE TABLE IF NOT EXISTS districts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name varchar(100) NOT NULL,
  slug varchar(100) NOT NULL UNIQUE,
  region varchar(50) NOT NULL, -- North, South, East, West, Central
  description text,
  landmarks text[],
  transport_hubs text[],
  postal_codes text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  description text,
  address text NOT NULL,
  postal_code varchar(10),
  district varchar(100),
  phone varchar(20),
  email varchar(255),
  website varchar(500),
  
  -- Location data
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  location geography(POINT, 4326),
  
  -- Business details
  category_ids uuid[] DEFAULT '{}',
  category_slugs text[] DEFAULT '{}',
  cuisine_types text[] DEFAULT '{}',
  price_range varchar(20) CHECK (price_range IN ('budget', 'mid-range', 'premium')),
  features text[] DEFAULT '{}',
  
  -- Halal certification
  halal_certified boolean DEFAULT false,
  halal_cert_number varchar(100),
  halal_cert_expiry date,
  
  -- Business status
  is_active boolean DEFAULT true,
  is_premium boolean DEFAULT false,
  verification_status varchar(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  
  -- Operating hours (JSON format)
  operating_hours jsonb,
  
  -- Social media and delivery
  social_media jsonb,
  delivery_platforms text[] DEFAULT '{}',
  
  -- Metrics
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  
  -- Ownership
  owner_id uuid,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_businesses_district ON businesses (district);
CREATE INDEX IF NOT EXISTS idx_businesses_category_slugs ON businesses USING GIN (category_slugs);
CREATE INDEX IF NOT EXISTS idx_businesses_verification_status ON businesses (verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses (rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON businesses (is_active);

-- =====================================================
-- BULK IMPORT SYSTEM TABLES
-- =====================================================

-- Import jobs tracking
CREATE TABLE IF NOT EXISTS import_jobs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename varchar(255) NOT NULL,
  original_filename varchar(255) NOT NULL,
  file_size integer,
  mime_type varchar(100),
  
  -- Job status
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Import statistics
  total_records integer DEFAULT 0,
  successful_imports integer DEFAULT 0,
  failed_imports integer DEFAULT 0,
  duplicate_records integer DEFAULT 0,
  
  -- Processing details
  processing_started_at timestamp with time zone,
  processing_completed_at timestamp with time zone,
  error_details jsonb,
  
  -- Import configuration
  field_mappings jsonb,
  validation_rules jsonb,
  
  -- Ownership
  imported_by uuid,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Business duplicates detection
CREATE TABLE IF NOT EXISTS business_duplicates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  original_business_id uuid,
  duplicate_business_id uuid,
  similarity_score decimal(3,2),
  similarity_factors jsonb,
  resolution_status varchar(20) DEFAULT 'pending' CHECK (resolution_status IN ('pending', 'merged', 'ignored', 'false_positive')),
  resolved_by uuid,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- SEO SYSTEM TABLES
-- =====================================================

-- SEO pages for programmatic content
CREATE TABLE IF NOT EXISTS seo_pages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug varchar(500) NOT NULL UNIQUE,
  page_type varchar(50) NOT NULL CHECK (page_type IN ('category', 'location', 'combination', 'feature', 'price', 'cuisine')),
  
  -- SEO metadata
  title varchar(255) NOT NULL,
  meta_description text,
  h1_title varchar(255),
  canonical_url varchar(500),
  
  -- Content
  content jsonb NOT NULL,
  
  -- Page configuration
  filters jsonb,
  business_count integer DEFAULT 0,
  
  -- SEO data
  schema_markup jsonb,
  related_pages text[] DEFAULT '{}',
  
  -- Publishing
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  last_content_update timestamp with time zone DEFAULT now(),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- VIEWS FOR OPTIMIZED QUERIES
-- =====================================================

-- Business search view with aggregated data
CREATE OR REPLACE VIEW business_search_view AS
SELECT 
  b.*,
  COALESCE(array_agg(DISTINCT c.name) FILTER (WHERE c.id IS NOT NULL), '{}') as category_names,
  COALESCE(array_agg(DISTINCT c.slug) FILTER (WHERE c.id IS NOT NULL), '{}') as category_slugs_expanded
FROM businesses b
LEFT JOIN categories c ON c.id = ANY(b.category_ids)
WHERE b.is_active = true
GROUP BY b.id;

-- Import statistics view
CREATE OR REPLACE VIEW import_statistics AS
SELECT 
  DATE(created_at) as import_date,
  COUNT(*) as total_jobs,
  SUM(successful_imports) as total_successful,
  SUM(failed_imports) as total_failed,
  SUM(total_records) as total_records,
  AVG(EXTRACT(EPOCH FROM (processing_completed_at - processing_started_at))/60) as avg_duration_minutes
FROM import_jobs
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY import_date DESC;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_duplicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and districts
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Districts are publicly readable" ON districts FOR SELECT USING (is_active = true);

-- Business policies
CREATE POLICY "Businesses are publicly readable" ON businesses 
  FOR SELECT USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Business owners can update their businesses" ON businesses 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can view their businesses" ON businesses 
  FOR SELECT USING (auth.uid() = owner_id);

-- Admin policies (for authenticated admin users)
CREATE POLICY "Admins can manage import jobs" ON import_jobs 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage duplicates" ON business_duplicates 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage businesses" ON businesses 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- SEO pages are publicly readable
CREATE POLICY "SEO pages are publicly readable" ON seo_pages 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage SEO pages" ON seo_pages 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- INITIAL SEED DATA
-- =====================================================

-- Insert Singapore districts
INSERT INTO districts (name, slug, region, description, landmarks, transport_hubs) VALUES
('Orchard', 'orchard', 'Central', 'Premier shopping and entertainment district', ARRAY['ION Orchard', 'Takashimaya', 'Paragon'], ARRAY['Orchard MRT', 'Somerset MRT']),
('Marina Bay', 'marina-bay', 'Central', 'Iconic waterfront district with world-class attractions', ARRAY['Marina Bay Sands', 'Gardens by the Bay', 'Merlion'], ARRAY['Bayfront MRT', 'Marina Bay MRT']),
('Chinatown', 'chinatown', 'Central', 'Historic cultural district with traditional architecture', ARRAY['Buddha Tooth Relic Temple', 'Chinatown Heritage Centre'], ARRAY['Chinatown MRT', 'Outram Park MRT']),
('Little India', 'little-india', 'Central', 'Vibrant cultural enclave with Indian heritage', ARRAY['Sri Veeramakaliamman Temple', 'Mustafa Centre'], ARRAY['Little India MRT', 'Farrer Park MRT']),
('Kampong Glam', 'kampong-glam', 'Central', 'Historic Malay-Muslim quarter', ARRAY['Sultan Mosque', 'Malay Heritage Centre', 'Haji Lane'], ARRAY['Bugis MRT', 'Arab Street']),
('Sentosa', 'sentosa', 'South', 'Resort island with beaches and attractions', ARRAY['Universal Studios', 'S.E.A. Aquarium'], ARRAY['HarbourFront MRT', 'Sentosa Express']),
('Jurong East', 'jurong-east', 'West', 'Major residential and commercial hub', ARRAY['Jurong Point', 'IMM'], ARRAY['Jurong East MRT']),
('Tampines', 'tampines', 'East', 'Satellite town with comprehensive amenities', ARRAY['Tampines Mall', 'Century Square'], ARRAY['Tampines MRT']),
('Woodlands', 'woodlands', 'North', 'Northern regional centre near Malaysia border', ARRAY['Causeway Point'], ARRAY['Woodlands MRT']),
('Toa Payoh', 'toa-payoh', 'Central', 'Mature residential estate with local charm', ARRAY['Toa Payoh HDB Hub'], ARRAY['Toa Payoh MRT'])
ON CONFLICT (slug) DO NOTHING;

-- Insert business categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Restaurants', 'restaurants', 'Full-service dining establishments', 'utensils', 1),
('Cafes', 'cafes', 'Coffee shops and casual dining', 'coffee', 2),
('Fast Food', 'fast-food', 'Quick service restaurants', 'zap', 3),
('Bakeries', 'bakeries', 'Bread, pastries, and baked goods', 'cake', 4),
('Grocery Stores', 'grocery-stores', 'Food and household items', 'shopping-cart', 5),
('Butchers', 'butchers', 'Halal meat suppliers', 'meat', 6),
('Catering', 'catering', 'Event and party catering services', 'truck', 7),
('Food Courts', 'food-courts', 'Multi-vendor dining locations', 'users', 8),
('Hotels', 'hotels', 'Accommodation with halal services', 'bed', 9),
('Services', 'services', 'Halal-compliant services', 'settings', 10)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_import_jobs_updated_at BEFORE UPDATE ON import_jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update business location from lat/lng
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update location
CREATE TRIGGER update_business_location_trigger 
    BEFORE INSERT OR UPDATE ON businesses 
    FOR EACH ROW EXECUTE PROCEDURE update_business_location();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Halal SG Connect production database setup completed successfully!';
    RAISE NOTICE 'Tables created: categories, districts, businesses, import_jobs, business_duplicates, seo_pages';
    RAISE NOTICE 'Views created: business_search_view, import_statistics';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Initial seed data inserted for Singapore districts and categories';
END $$;