-- 🏢 BUSINESSES TABLE LOCATION ENHANCEMENT
-- Adds planning area and property district fields to businesses table
-- Links existing businesses with proper location data

-- 📋 ADD NEW LOCATION COLUMNS TO BUSINESSES TABLE
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS planning_area varchar(100);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS property_district_code varchar(10);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS area_type varchar(50) DEFAULT 'mixed';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS location_keywords text[] DEFAULT '{}';

-- 📍 UPDATE EXISTING BUSINESSES WITH LOCATION DATA
-- Based on current district field, map to planning areas and property districts

-- High-density areas (current sample businesses)
UPDATE businesses 
SET 
  planning_area = CASE 
    WHEN district = 'Central' THEN 'Downtown Core'
    WHEN district = 'East' THEN 'Tampines'
    WHEN district = 'West' THEN 'Jurong East'
    WHEN district = 'North' THEN 'Woodlands'
    WHEN district = 'Northeast' THEN 'Hougang'
    ELSE planning_area  -- Keep existing if already set
  END,
  property_district_code = CASE
    WHEN district = 'Central' THEN 'D01'
    WHEN district = 'East' THEN 'D18'
    WHEN district = 'West' THEN 'D22'
    WHEN district = 'North' THEN 'D25'
    WHEN district = 'Northeast' THEN 'D19'
    ELSE property_district_code  -- Keep existing if already set
  END,
  area_type = CASE
    WHEN district = 'Central' THEN 'business'
    WHEN district IN ('East', 'West', 'North', 'Northeast') THEN 'residential'
    ELSE 'mixed'
  END,
  location_keywords = CASE
    WHEN district = 'Central' THEN ARRAY['CBD', 'business district', 'financial center', 'tourist area']
    WHEN district = 'East' THEN ARRAY['family area', 'shopping center', 'residential town', 'regional hub']
    WHEN district = 'West' THEN ARRAY['industrial area', 'family town', 'shopping center', 'entertainment']
    WHEN district = 'North' THEN ARRAY['border area', 'international', 'family town', 'cross-border']
    WHEN district = 'Northeast' THEN ARRAY['residential area', 'family town', 'community', 'new development']
    ELSE ARRAY['mixed area', 'community', 'local dining']
  END
WHERE planning_area IS NULL OR property_district_code IS NULL;

-- 📊 CREATE LOCATION MAPPING TABLE FOR REFERENCE
CREATE TABLE IF NOT EXISTS location_mappings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  planning_area varchar(100) NOT NULL,
  property_district_code varchar(10) NOT NULL,
  area_characteristics jsonb DEFAULT '{}',
  business_suitability jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- 🗺️ INSERT COMPREHENSIVE LOCATION MAPPINGS
-- Maps planning areas to property districts for business categorization
INSERT INTO location_mappings (planning_area, property_district_code, area_characteristics, business_suitability) VALUES

-- Central Region Mappings
('Downtown Core', 'D01', '{"type": "business", "density": "very_high", "character": "financial"}', '{"restaurants": "premium", "cafes": "business", "services": "corporate"}'),
('Downtown Core', 'D06', '{"type": "government", "density": "high", "character": "civic"}', '{"restaurants": "business_lunch", "cafes": "government", "services": "professional"}'),
('Marina East', 'D01', '{"type": "tourist", "density": "high", "character": "waterfront"}', '{"restaurants": "tourist", "cafes": "premium", "services": "hospitality"}'),
('Marina South', 'D01', '{"type": "tourist", "density": "very_high", "character": "entertainment"}', '{"restaurants": "international", "cafes": "tourist", "services": "entertainment"}'),
('Outram', 'D02', '{"type": "heritage", "density": "high", "character": "cultural"}', '{"restaurants": "cultural", "cafes": "heritage", "services": "traditional"}'),
('Bukit Merah', 'D02', '{"type": "mixed", "density": "medium", "character": "residential"}', '{"restaurants": "family", "cafes": "neighborhood", "services": "community"}'),
('Bukit Merah', 'D03', '{"type": "trendy", "density": "medium", "character": "lifestyle"}', '{"restaurants": "trendy", "cafes": "artisanal", "services": "creative"}'),
('Bukit Merah', 'D04', '{"type": "waterfront", "density": "medium", "character": "family"}', '{"restaurants": "family", "cafes": "casual", "services": "recreation"}'),
('Rochor', 'D07', '{"type": "cultural", "density": "very_high", "character": "muslim_heritage"}', '{"restaurants": "halal_traditional", "cafes": "middle_eastern", "services": "islamic"}'),
('Serangoon', 'D08', '{"type": "cultural", "density": "very_high", "character": "indian_muslim"}', '{"restaurants": "indian_halal", "cafes": "traditional", "services": "cultural"}'),
('Orchard', 'D09', '{"type": "tourist", "density": "very_high", "character": "luxury"}', '{"restaurants": "international", "cafes": "premium", "services": "luxury"}'),
('River Valley', 'D09', '{"type": "upscale", "density": "high", "character": "premium"}', '{"restaurants": "fine_dining", "cafes": "upscale", "services": "premium"}'),
('Tanglin', 'D10', '{"type": "diplomatic", "density": "low", "character": "exclusive"}', '{"restaurants": "exclusive", "cafes": "premium", "services": "diplomatic"}'),
('Bukit Timah', 'D10', '{"type": "residential", "density": "low", "character": "affluent"}', '{"restaurants": "family_premium", "cafes": "upscale", "services": "exclusive"}'),
('Newton', 'D11', '{"type": "mixed", "density": "high", "character": "convenient"}', '{"restaurants": "hawker", "cafes": "convenient", "services": "medical"}'),
('Novena', 'D11', '{"type": "medical", "density": "medium", "character": "healthcare"}', '{"restaurants": "healthcare", "cafes": "medical", "services": "hospital"}'),

-- East Region Mappings
('Marine Parade', 'D15', '{"type": "residential", "density": "medium", "character": "beachfront"}', '{"restaurants": "family", "cafes": "beach", "services": "recreation"}'),
('Bedok', 'D16', '{"type": "residential", "density": "high", "character": "family"}', '{"restaurants": "affordable_family", "cafes": "neighborhood", "services": "community"}'),
('Changi', 'D17', '{"type": "airport", "density": "medium", "character": "international"}', '{"restaurants": "international", "cafes": "traveler", "services": "aviation"}'),
('Pasir Ris', 'D18', '{"type": "residential", "density": "medium", "character": "family_beach"}', '{"restaurants": "family", "cafes": "beach", "services": "recreation"}'),
('Tampines', 'D18', '{"type": "regional", "density": "very_high", "character": "comprehensive"}', '{"restaurants": "diverse", "cafes": "shopping", "services": "regional"}'),
('Paya Lebar', 'D14', '{"type": "mixed", "density": "medium", "character": "commercial"}', '{"restaurants": "office", "cafes": "business", "services": "commercial"}'),

-- North Region Mappings  
('Woodlands', 'D25', '{"type": "border", "density": "high", "character": "international"}', '{"restaurants": "malaysian_influence", "cafes": "cross_border", "services": "international"}'),
('Yishun', 'D27', '{"type": "residential", "density": "medium", "character": "community"}', '{"restaurants": "family", "cafes": "neighborhood", "services": "community"}'),
('Sembawang', 'D27', '{"type": "residential", "density": "low", "character": "quiet"}', '{"restaurants": "local", "cafes": "quiet", "services": "neighborhood"}'),
('Seletar', 'D28', '{"type": "industrial", "density": "very_low", "character": "aerospace"}', '{"restaurants": "worker", "cafes": "industrial", "services": "specialized"}'),

-- West Region Mappings
('Clementi', 'D05', '{"type": "university", "density": "medium", "character": "academic"}', '{"restaurants": "student", "cafes": "academic", "services": "university"}'),
('Jurong East', 'D22', '{"type": "regional", "density": "very_high", "character": "comprehensive"}', '{"restaurants": "diverse", "cafes": "shopping", "services": "regional"}'),
('Jurong West', 'D22', '{"type": "residential", "density": "high", "character": "family"}', '{"restaurants": "family", "cafes": "neighborhood", "services": "community"}'),
('Boon Lay', 'D22', '{"type": "mixed", "density": "medium", "character": "industrial_residential"}', '{"restaurants": "worker_family", "cafes": "practical", "services": "community"}'),
('Tuas', 'D22', '{"type": "industrial", "density": "low", "character": "port"}', '{"restaurants": "worker", "cafes": "basic", "services": "industrial"}'),
('Bukit Panjang', 'D23', '{"type": "residential", "density": "low", "character": "family"}', '{"restaurants": "family", "cafes": "neighborhood", "services": "community"}'),
('Choa Chu Kang', 'D23', '{"type": "residential", "density": "low", "character": "family"}', '{"restaurants": "family", "cafes": "community", "services": "neighborhood"}'),
('Tengah', 'D24', '{"type": "smart_town", "density": "low", "character": "sustainable"}', '{"restaurants": "modern", "cafes": "sustainable", "services": "smart"}'),

-- Northeast Region Mappings
('Hougang', 'D19', '{"type": "residential", "density": "medium", "character": "traditional"}', '{"restaurants": "traditional", "cafes": "local", "services": "community"}'),
('Punggol', 'D19', '{"type": "new_town", "density": "medium", "character": "waterfront"}', '{"restaurants": "modern", "cafes": "waterfront", "services": "family"}'),
('Sengkang', 'D19', '{"type": "new_town", "density": "medium", "character": "modern"}', '{"restaurants": "family", "cafes": "modern", "services": "contemporary"}'),
('Ang Mo Kio', 'D20', '{"type": "residential", "density": "medium", "character": "family"}', '{"restaurants": "family", "cafes": "neighborhood", "services": "community"}'),
('Bishan', 'D20', '{"type": "residential", "density": "medium", "character": "family"}', '{"restaurants": "family", "cafes": "park", "services": "community"}')

ON CONFLICT (planning_area, property_district_code) DO UPDATE SET
  area_characteristics = EXCLUDED.area_characteristics,
  business_suitability = EXCLUDED.business_suitability;

-- 🔄 CREATE FUNCTION TO AUTO-ASSIGN LOCATION DATA FOR NEW BUSINESSES
CREATE OR REPLACE FUNCTION assign_business_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign planning area and property district based on district
  IF NEW.planning_area IS NULL OR NEW.property_district_code IS NULL THEN
    SELECT lm.planning_area, lm.property_district_code
    INTO NEW.planning_area, NEW.property_district_code
    FROM location_mappings lm
    WHERE lm.planning_area = COALESCE(NEW.planning_area, 
      CASE NEW.district
        WHEN 'Central' THEN 'Downtown Core'
        WHEN 'East' THEN 'Tampines' 
        WHEN 'West' THEN 'Jurong East'
        WHEN 'North' THEN 'Woodlands'
        WHEN 'Northeast' THEN 'Hougang'
        ELSE 'Downtown Core'
      END)
    LIMIT 1;
  END IF;
  
  -- Set area type based on property district
  IF NEW.area_type IS NULL THEN
    SELECT 
      CASE pd.district_type
        WHEN 'business' THEN 'business'
        WHEN 'tourist' THEN 'tourist'
        WHEN 'cultural' THEN 'cultural'
        ELSE 'mixed'
      END
    INTO NEW.area_type
    FROM property_districts pd
    WHERE pd.code = NEW.property_district_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 📌 CREATE TRIGGER FOR AUTO-ASSIGNMENT
DROP TRIGGER IF EXISTS business_location_assignment ON businesses;
CREATE TRIGGER business_location_assignment
  BEFORE INSERT OR UPDATE OF district, planning_area, property_district_code
  ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION assign_business_location();

-- 📊 VERIFICATION QUERIES

-- Check business location distribution
SELECT 
  'Business Location Distribution' as analysis,
  planning_area,
  property_district_code,
  area_type,
  COUNT(*) as business_count
FROM businesses 
WHERE planning_area IS NOT NULL 
GROUP BY planning_area, property_district_code, area_type
ORDER BY business_count DESC;

-- Verify location mappings
SELECT 
  'Location Mappings Summary' as status,
  COUNT(*) as total_mappings,
  COUNT(DISTINCT planning_area) as unique_areas,
  COUNT(DISTINCT property_district_code) as unique_districts
FROM location_mappings;

-- Show businesses with enhanced location data
SELECT 
  'Enhanced Business Data Sample' as sample,
  name,
  district as old_district,
  planning_area,
  property_district_code,
  area_type,
  location_keywords
FROM businesses 
WHERE planning_area IS NOT NULL
LIMIT 10;

-- Check for businesses missing location data
SELECT 
  'Missing Location Data Check' as check,
  COUNT(*) FILTER (WHERE planning_area IS NULL) as missing_planning_area,
  COUNT(*) FILTER (WHERE property_district_code IS NULL) as missing_property_district,
  COUNT(*) FILTER (WHERE area_type IS NULL) as missing_area_type,
  COUNT(*) as total_businesses
FROM businesses;

-- ✅ SUCCESS MESSAGE
SELECT '🎉 SUCCESS: Business location enhancement completed with auto-assignment triggers!' as result;