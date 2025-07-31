-- Bulk Import Schema for Halal SG Connect
-- Migration: 001_bulk_import_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Import Jobs Table
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(50),
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  error_log TEXT[],
  import_type VARCHAR(50) DEFAULT 'csv' CHECK (import_type IN ('csv', 'json', 'api', 'manual')),
  imported_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Businesses Table (extending existing)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS coordinates GEOGRAPHY(POINT, 4326);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS halal_certified BOOLEAN DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS certification_body VARCHAR(100);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS certification_number VARCHAR(100);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'needs_review'));
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS import_source VARCHAR(100);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS import_job_id UUID REFERENCES import_jobs(id);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR(100);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS delivery_platforms TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS price_level INTEGER CHECK (price_level BETWEEN 1 AND 4);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cuisine_types TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS special_diets TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS business_hours JSONB;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS amenities TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS payment_methods TEXT[];

-- Business Import Sources Table
CREATE TABLE business_import_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('csv', 'api', 'scraping', 'manual', 'government', 'directory')),
  source_name VARCHAR(255),
  source_url VARCHAR(500),
  external_id VARCHAR(255),
  import_job_id UUID REFERENCES import_jobs(id),
  data_quality_score DECIMAL(3,2) CHECK (data_quality_score BETWEEN 0 AND 1),
  last_verified TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Pages Table for Programmatic SEO
CREATE TABLE seo_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  page_type VARCHAR(50) NOT NULL CHECK (page_type IN ('category', 'location', 'combination', 'feature', 'price', 'cuisine')),
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  h1_title VARCHAR(255),
  content JSONB,
  filters JSONB NOT NULL,
  business_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  last_content_update TIMESTAMP WITH TIME ZONE,
  seo_score DECIMAL(3,2),
  is_published BOOLEAN DEFAULT true,
  canonical_url VARCHAR(500),
  schema_markup JSONB,
  related_pages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Districts/Areas Table for Location-based SEO
CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  region VARCHAR(50), -- North, South, East, West, Central
  postal_sectors INTEGER[],
  coordinates GEOGRAPHY(POINT, 4326),
  area_polygon GEOGRAPHY(POLYGON, 4326),
  population INTEGER,
  business_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  landmarks TEXT[],
  transport_hubs TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table Enhancement
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  icon VARCHAR(50),
  description TEXT,
  business_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Categories Junction Table
CREATE TABLE business_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, category_id)
);

-- Duplicate Detection Table
CREATE TABLE business_duplicates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id_1 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  business_id_2 UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  similarity_score DECIMAL(3,2) NOT NULL CHECK (similarity_score BETWEEN 0 AND 1),
  match_type VARCHAR(50) NOT NULL CHECK (match_type IN ('exact_name', 'fuzzy_name', 'address', 'phone', 'coordinates', 'combined')),
  confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('low', 'medium', 'high', 'exact')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed_duplicate', 'not_duplicate', 'merged')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  merge_target_id UUID REFERENCES businesses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (business_id_1 != business_id_2)
);

-- Import Statistics View
CREATE VIEW import_statistics AS
SELECT 
  DATE_TRUNC('day', created_at) AS import_date,
  COUNT(*) AS total_jobs,
  SUM(successful_imports) AS total_successful,
  SUM(failed_imports) AS total_failed,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60) AS avg_duration_minutes
FROM import_jobs 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY import_date DESC;

-- Business Search View with Enhanced Data
CREATE VIEW business_search_view AS
SELECT 
  b.id,
  b.name,
  b.slug,
  b.description,
  b.address,
  b.postal_code,
  b.district,
  b.phone,
  b.email,
  b.website,
  b.rating,
  b.review_count,
  b.price_range,
  b.halal_certified,
  b.certification_body,
  b.is_premium,
  b.subscription_tier,
  b.features,
  b.tags,
  b.coordinates,
  b.verification_status,
  b.cuisine_types,
  b.amenities,
  b.business_hours,
  b.created_at,
  b.updated_at,
  ARRAY_AGG(DISTINCT c.name) AS category_names,
  ARRAY_AGG(DISTINCT c.slug) AS category_slugs,
  COUNT(DISTINCT r.id) AS total_reviews
FROM businesses b
LEFT JOIN business_categories bc ON b.id = bc.business_id
LEFT JOIN categories c ON bc.category_id = c.id
LEFT JOIN reviews r ON b.id = r.business_id
GROUP BY b.id;

-- Indexes for Performance
CREATE INDEX idx_businesses_coordinates ON businesses USING GIST(coordinates);
CREATE INDEX idx_businesses_district ON businesses(district);
CREATE INDEX idx_businesses_halal_certified ON businesses(halal_certified);
CREATE INDEX idx_businesses_verification_status ON businesses(verification_status);
CREATE INDEX idx_businesses_import_job_id ON businesses(import_job_id);
CREATE INDEX idx_business_categories_business_id ON business_categories(business_id);
CREATE INDEX idx_business_categories_category_id ON business_categories(category_id);
CREATE INDEX idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX idx_seo_pages_page_type ON seo_pages(page_type);
CREATE INDEX idx_seo_pages_is_published ON seo_pages(is_published);
CREATE INDEX idx_import_jobs_status ON import_jobs(status);
CREATE INDEX idx_import_jobs_created_at ON import_jobs(created_at);
CREATE INDEX idx_business_duplicates_similarity_score ON business_duplicates(similarity_score);

-- Full Text Search
CREATE INDEX idx_businesses_search ON businesses USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(tags::text, '')));

-- RLS (Row Level Security) Policies
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own import jobs
CREATE POLICY "Users can view own import jobs" ON import_jobs
  FOR SELECT USING (auth.uid() = imported_by);

-- Allow authenticated users to create import jobs
CREATE POLICY "Users can create import jobs" ON import_jobs
  FOR INSERT WITH CHECK (auth.uid() = imported_by);

-- Allow public read access to published SEO pages
CREATE POLICY "Public can view published SEO pages" ON seo_pages
  FOR SELECT USING (is_published = true);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_import_jobs_updated_at BEFORE UPDATE ON import_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_import_sources_updated_at BEFORE UPDATE ON business_import_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_pages_updated_at BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_duplicates_updated_at BEFORE UPDATE ON business_duplicates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();