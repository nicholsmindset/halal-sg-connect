-- 🚀 Halal SG Connect - Database Setup Script
-- Copy this ENTIRE script and paste into Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  region varchar(50) NOT NULL,
  description text,
  landmarks text[],
  transport_hubs text[],
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
  district varchar(100),
  phone varchar(20),
  email varchar(255),
  website varchar(500),
  category_slugs text[] DEFAULT '{}',
  cuisine_types text[] DEFAULT '{}',
  price_range varchar(20) CHECK (price_range IN ('budget', 'mid-range', 'premium')),
  features text[] DEFAULT '{}',
  halal_certified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  verification_status varchar(20) DEFAULT 'verified',
  rating decimal(3,2) DEFAULT 4.0,
  review_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Import jobs table
CREATE TABLE IF NOT EXISTS import_jobs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename varchar(255) NOT NULL,
  status varchar(20) DEFAULT 'completed',
  total_records integer DEFAULT 0,
  successful_imports integer DEFAULT 0,
  failed_imports integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- SEO pages table
CREATE TABLE IF NOT EXISTS seo_pages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug varchar(500) NOT NULL UNIQUE,
  page_type varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  meta_description text,
  content jsonb NOT NULL,
  is_published boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert Singapore districts
INSERT INTO districts (name, slug, region, description, landmarks, transport_hubs) VALUES
('Orchard', 'orchard', 'Central', 'Premier shopping district', ARRAY['ION Orchard', 'Takashimaya'], ARRAY['Orchard MRT']),
('Marina Bay', 'marina-bay', 'Central', 'Iconic waterfront district', ARRAY['Marina Bay Sands', 'Gardens by the Bay'], ARRAY['Bayfront MRT']),
('Chinatown', 'chinatown', 'Central', 'Historic cultural district', ARRAY['Buddha Tooth Relic Temple'], ARRAY['Chinatown MRT']),
('Little India', 'little-india', 'Central', 'Vibrant cultural enclave', ARRAY['Sri Veeramakaliamman Temple'], ARRAY['Little India MRT']),
('Kampong Glam', 'kampong-glam', 'Central', 'Historic Malay-Muslim quarter', ARRAY['Sultan Mosque', 'Haji Lane'], ARRAY['Bugis MRT']),
('Sentosa', 'sentosa', 'South', 'Resort island', ARRAY['Universal Studios'], ARRAY['Sentosa Express']),
('Jurong East', 'jurong-east', 'West', 'Major residential hub', ARRAY['Jurong Point'], ARRAY['Jurong East MRT']),
('Tampines', 'tampines', 'East', 'Satellite town', ARRAY['Tampines Mall'], ARRAY['Tampines MRT']),
('Woodlands', 'woodlands', 'North', 'Northern regional centre', ARRAY['Causeway Point'], ARRAY['Woodlands MRT']),
('Toa Payoh', 'toa-payoh', 'Central', 'Mature residential estate', ARRAY['Toa Payoh HDB Hub'], ARRAY['Toa Payoh MRT'])
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

-- Insert some sample businesses
INSERT INTO businesses (name, slug, description, address, district, category_slugs, cuisine_types, price_range, halal_certified, rating) VALUES
('Warong Nasi Pariaman', 'warong-nasi-pariaman', 'Authentic Indonesian Padang cuisine', '738 North Bridge Rd, Singapore 198706', 'Kampong Glam', ARRAY['restaurants'], ARRAY['indonesian'], 'budget', true, 4.2),
('The Malayan Council', 'the-malayan-council', 'Traditional Malay cuisine in heritage setting', '136 Neil Rd, Singapore 088865', 'Chinatown', ARRAY['restaurants'], ARRAY['malay'], 'mid-range', true, 4.5),
('Cafe Le Caire', 'cafe-le-caire', 'Authentic Middle Eastern cafe', '39 Arab St, Singapore 199738', 'Kampong Glam', ARRAY['cafes'], ARRAY['middle-eastern'], 'mid-range', true, 4.1),
('Zam Zam Restaurant', 'zam-zam-restaurant', 'Famous for murtabak and briyani since 1908', '697 North Bridge Rd, Singapore 198675', 'Kampong Glam', ARRAY['restaurants'], ARRAY['indian'], 'budget', true, 4.3),
('Istanbul Grill', 'istanbul-grill', 'Turkish cuisine with grilled specialties', '120 Sophia Rd, Singapore 228149', 'Little India', ARRAY['restaurants'], ARRAY['turkish'], 'mid-range', true, 4.4)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Database setup completed successfully!';
    RAISE NOTICE '✅ Tables created: categories, districts, businesses, import_jobs, seo_pages';
    RAISE NOTICE '✅ Sample data inserted: 10 districts, 10 categories, 5 sample businesses';
    RAISE NOTICE '🚀 Your Halal SG Connect database is ready!';
END $$;