-- 🏢 SINGAPORE PROPERTY DISTRICTS (D01-D28) MIGRATION
-- Creates property districts table and populates with all postal districts
-- Run this AFTER the comprehensive districts migration

-- 📋 CREATE PROPERTY DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS property_districts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code varchar(10) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  areas text[] NOT NULL DEFAULT '{}',
  description text,
  slug varchar(255) NOT NULL UNIQUE,
  district_type varchar(50) NOT NULL DEFAULT 'mixed',
  business_density varchar(20) NOT NULL DEFAULT 'medium',
  residential_character varchar(100),
  key_features text[],
  muslim_services text[],
  halal_dining_density varchar(20) DEFAULT 'medium',
  target_demographics text[],
  seo_title varchar(200),
  seo_description varchar(300),
  seo_keywords text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 🌟 INSERT ALL 28 SINGAPORE PROPERTY DISTRICTS
INSERT INTO property_districts (
  code, name, areas, description, slug, district_type, business_density, 
  residential_character, key_features, muslim_services, halal_dining_density,
  target_demographics, seo_title, seo_description, seo_keywords
) VALUES

-- CENTRAL BUSINESS DISTRICTS (D01-D08)
('D01', 'Boat Quay / Raffles Place / Marina Bay', 
 ARRAY['Downtown Core', 'Marina East', 'Marina South', 'Singapore River'],
 'Premier financial district with luxury hotels, upscale halal restaurants, and tourist attractions including Marina Bay Sands.',
 'd01-boat-quay-raffles-place-marina-bay', 'business', 'very_high',
 'Luxury condos and serviced apartments',
 ARRAY['Financial centers', 'Tourist attractions', 'Luxury hotels', 'Waterfront dining'],
 ARRAY['Hotel prayer rooms', 'Tourist information', 'International halal chains'],
 'high', ARRAY['Business executives', 'Tourists', 'Hotel guests'],
 'D01 Singapore - Halal Restaurants in Boat Quay, Raffles Place & Marina Bay',
 'Premium halal dining in Singapore''s financial heart. Luxury restaurants, business lunch spots, and tourist-friendly Muslim services in D01.',
 ARRAY['D01 halal restaurants', 'Marina Bay halal food', 'Raffles Place Muslim dining', 'CBD halal lunch']
),

('D02', 'Chinatown / Tanjong Pagar', 
 ARRAY['Outram', 'Bukit Merah'],
 'Historic cultural district blending Chinese heritage with modern business, offering diverse halal dining from traditional to contemporary.',
 'd02-chinatown-tanjong-pagar', 'mixed', 'high',
 'Mix of heritage shophouses and modern condos',
 ARRAY['Cultural heritage', 'Historic temples', 'Modern offices', 'Traditional markets'],
 ARRAY['Nearby mosques', 'Cultural tours', 'Heritage walks'],
 'high', ARRAY['Tourists', 'Young professionals', 'Heritage enthusiasts'],
 'D02 Singapore - Halal Food in Chinatown & Tanjong Pagar District',
 'Discover halal restaurants in historic Chinatown and modern Tanjong Pagar. Cultural dining experiences with Muslim-friendly services.',
 ARRAY['D02 halal food', 'Chinatown halal restaurants', 'Tanjong Pagar Muslim dining', 'heritage halal food']
),

('D03', 'Alexandra / Commonwealth / Tiong Bahru', 
 ARRAY['Bukit Merah', 'Queenstown'],
 'Trendy district mixing heritage charm with modern lifestyle, featuring hip cafes, artisanal eateries, and family-friendly halal options.',
 'd03-alexandra-commonwealth-tiong-bahru', 'mixed', 'medium',
 'Trendy heritage area with young families',
 ARRAY['Hip cafes', 'Art galleries', 'Heritage architecture', 'Weekend markets'],
 ARRAY['Community centers', 'Family services', 'Local mosques nearby'],
 'medium', ARRAY['Young families', 'Creative professionals', 'Heritage lovers'],
 'D03 Singapore - Halal Cafes & Restaurants in Tiong Bahru & Alexandra',
 'Trendy halal dining in D03''s hip neighborhoods. Artisanal cafes, heritage eateries, and family-friendly Muslim dining options.',
 ARRAY['D03 halal cafes', 'Tiong Bahru halal food', 'Alexandra halal restaurants', 'trendy Muslim dining']
),

('D04', 'Harbourfront / Telok Blangah', 
 ARRAY['Bukit Merah'],
 'Waterfront district with shopping centers, cable car access to Sentosa, and diverse halal dining from casual to upscale.',
 'd04-harbourfront-telok-blangah', 'mixed', 'medium',
 'Waterfront living with port views',
 ARRAY['Harbourfront Centre', 'Cable car station', 'Waterfront dining', 'Port activities'],
 ARRAY['Shopping center services', 'Tourist facilities', 'Transportation hubs'],
 'medium', ARRAY['Families', 'Tourists', 'Port workers'],
 'D04 Singapore - Halal Restaurants at Harbourfront & Telok Blangah',
 'Waterfront halal dining in D04. From casual meals to upscale restaurants with harbor views, perfect for families and tourists.',
 ARRAY['D04 halal restaurants', 'Harbourfront halal food', 'waterfront Muslim dining', 'Sentosa halal options']
),

('D05', 'Buona Vista / West Coast / Clementi New Town', 
 ARRAY['Clementi', 'West Coast'],
 'University belt with student-friendly halal food, research facilities, and family residential areas with diverse dining options.',
 'd05-buona-vista-west-coast-clementi', 'mixed', 'medium',
 'University town with families and students',
 ARRAY['NUS campus', 'Research institutes', 'Student housing', 'Family parks'],
 ARRAY['University prayer rooms', 'Student services', 'Family centers'],
 'medium', ARRAY['Students', 'Academics', 'Young families'],
 'D05 Singapore - Student-Friendly Halal Food in Buona Vista & Clementi',
 'Affordable halal dining near NUS and research centers. Student-friendly options and family restaurants in D05 university belt.',
 ARRAY['D05 halal food', 'NUS halal restaurants', 'Clementi Muslim dining', 'student halal meals']
),

('D06', 'City Hall / Clarke Quay', 
 ARRAY['Downtown Core', 'Singapore River'],
 'Historic civic district with government buildings, nightlife at Clarke Quay, and premium halal dining for business and leisure.',
 'd06-city-hall-clarke-quay', 'business', 'very_high',
 'Premium city living and hotels',
 ARRAY['Government buildings', 'Historic landmarks', 'Nightlife district', 'River cruises'],
 ARRAY['Hotel prayer facilities', 'Tourist services', 'Government offices'],
 'high', ARRAY['Government workers', 'Business travelers', 'Nightlife seekers'],
 'D06 Singapore - Halal Restaurants in City Hall & Clarke Quay District',
 'Premium halal dining in Singapore''s civic heart. Business lunch spots, nightlife venues, and tourist-friendly Muslim restaurants.',
 ARRAY['D06 halal restaurants', 'City Hall halal food', 'Clarke Quay Muslim dining', 'government district halal']
),

('D07', 'Beach Road / Bugis / Rochor', 
 ARRAY['Rochor'],
 'Cultural melting pot with Arab Street, traditional crafts, authentic Middle Eastern halal cuisine, and vibrant street food scene.',
 'd07-beach-road-bugis-rochor', 'cultural', 'high',
 'Cultural heritage with modern developments',
 ARRAY['Arab Street', 'Sultan Mosque', 'Traditional crafts', 'Cultural shops'],
 ARRAY['Sultan Mosque', 'Islamic shops', 'Cultural centers', 'Halal certification'],
 'very_high', ARRAY['Muslim community', 'Cultural tourists', 'Food enthusiasts'],
 'D07 Singapore - Authentic Halal Food in Arab Street & Bugis',
 'Authentic Middle Eastern and Malay halal cuisine in D07. Traditional recipes, cultural dining, and Islamic heritage experiences.',
 ARRAY['D07 halal food', 'Arab Street restaurants', 'Bugis Muslim dining', 'Middle Eastern halal', 'Sultan Mosque area']
),

('D08', 'Farrer Park / Serangoon Road', 
 ARRAY['Serangoon'],
 'Little India district with authentic Indian Muslim cuisine, traditional spices, cultural shops, and vibrant halal food scene.',
 'd08-farrer-park-serangoon-road', 'cultural', 'high',
 'Cultural enclave with traditional shophouses',
 ARRAY['Little India', 'Traditional markets', 'Spice shops', 'Cultural festivals'],
 ARRAY['Local mosques', 'Cultural associations', 'Traditional services'],
 'very_high', ARRAY['Indian Muslim community', 'Cultural tourists', 'Spice enthusiasts'],
 'D08 Singapore - Indian Halal Restaurants in Little India & Serangoon',
 'Authentic Indian Muslim halal cuisine in D08 Little India. Traditional biryanis, curries, and cultural dining experiences.',
 ARRAY['D08 Indian halal', 'Little India Muslim food', 'Serangoon Road halal', 'Indian Muslim restaurants']
),

-- PREMIUM RESIDENTIAL & TOURIST AREAS (D09-D11)
('D09', 'Orchard / River Valley', 
 ARRAY['Orchard', 'River Valley'],
 'Premier shopping and entertainment district with luxury malls, international halal dining, and premium Muslim-friendly services.',
 'd09-orchard-river-valley', 'tourist', 'very_high',
 'Luxury condos and premium serviced apartments',
 ARRAY['Luxury shopping', 'International hotels', 'Entertainment venues', 'Premium dining'],
 ARRAY['Hotel prayer rooms', 'Luxury services', 'International halal chains', 'Tourist information'],
 'very_high', ARRAY['Tourists', 'Luxury shoppers', 'Business travelers', 'Expatriates'],
 'D09 Singapore - Luxury Halal Dining in Orchard & River Valley',
 'Premium halal restaurants in Singapore''s shopping paradise. International cuisine, luxury dining, and tourist-friendly Muslim services.',
 ARRAY['D09 halal restaurants', 'Orchard halal food', 'luxury Muslim dining', 'premium halal cuisine']
),

('D10', 'Tanglin / Holland / Bukit Timah', 
 ARRAY['Tanglin', 'Bukit Timah'],
 'Upscale residential area with embassies, international schools, premium halal dining, and family-oriented Muslim services.',
 'd10-tanglin-holland-bukit-timah', 'residential', 'low',
 'Exclusive residential with landed properties',
 ARRAY['Embassy row', 'International schools', 'Nature reserves', 'Premium clubs'],
 ARRAY['International school services', 'Embassy facilities', 'Premium family services'],
 'low', ARRAY['Diplomats', 'Expatriate families', 'Affluent residents'],
 'D10 Singapore - Premium Halal Restaurants in Tanglin & Bukit Timah',
 'Exclusive halal dining in D10''s diplomatic quarter. Premium restaurants, international schools, and affluent family services.',
 ARRAY['D10 premium halal', 'Tanglin halal restaurants', 'diplomatic area Muslim dining', 'international school halal']
),

('D11', 'Newton / Novena / Watten Estate', 
 ARRAY['Newton', 'Novena'],
 'Medical hub with hospitals, shopping centers, famous Newton Food Centre, and convenient halal dining for healthcare workers.',
 'd11-newton-novena-watten', 'mixed', 'medium',
 'Medical district with convenient living',
 ARRAY['Medical facilities', 'Newton Food Centre', 'Shopping centers', 'MRT connectivity'],
 ARRAY['Hospital services', 'Medical facilities', 'Transport hubs'],
 'high', ARRAY['Healthcare workers', 'Medical tourists', 'Convenient diners'],
 'D11 Singapore - Halal Food Near Hospitals in Newton & Novena',
 'Convenient halal dining in D11 medical district. Hospital-friendly restaurants, Newton hawker food, and healthcare worker meals.',
 ARRAY['D11 halal food', 'Newton Food Centre halal', 'hospital area Muslim dining', 'medical district halal']
),

-- MATURE RESIDENTIAL ESTATES (D12-D20)
('D12', 'Balestier / Toa Payoh', 
 ARRAY['Toa Payoh'],
 'Established residential town with traditional coffee shops, halal food courts, community centers, and strong neighborhood spirit.',
 'd12-balestier-toa-payoh', 'residential', 'medium',
 'Mature HDB estate with strong community',
 ARRAY['Traditional coffee shops', 'Community centers', 'Local markets', 'Neighborhood spirit'],
 ARRAY['Community centers', 'Local mosques', 'Neighborhood services'],
 'medium', ARRAY['Families', 'Elderly residents', 'Community members'],
 'D12 Singapore - Traditional Halal Food in Balestier & Toa Payoh',
 'Traditional halal dining in D12''s mature estate. Local coffee shops, food courts, and community-centered Muslim dining.',
 ARRAY['D12 halal food', 'Toa Payoh Muslim dining', 'traditional halal coffee shops', 'community halal food']
),

('D13', 'Macpherson / Potong Pasir', 
 ARRAY['Kallang'],
 'Quiet residential area with local eateries, community facilities, and authentic neighborhood halal dining experiences.',
 'd13-macpherson-potong-pasir', 'residential', 'low',
 'Quiet neighborhood with local character',
 ARRAY['Local eateries', 'Quiet streets', 'Community facilities', 'Neighborhood charm'],
 ARRAY['Local community centers', 'Neighborhood mosques'],
 'medium', ARRAY['Local residents', 'Families', 'Quiet diners'],
 'D13 Singapore - Local Halal Dining in Macpherson & Potong Pasir',
 'Authentic neighborhood halal food in D13. Local eateries, community dining, and quiet residential area Muslim restaurants.',
 ARRAY['D13 local halal', 'Macpherson Muslim food', 'neighborhood halal dining', 'quiet area halal']
),

('D14', 'Kembangan / Eunos / Paya Lebar', 
 ARRAY['Paya Lebar'],
 'Mixed residential-commercial area with office buildings, shopping centers, and diverse halal food options for workers and families.',
 'd14-kembangan-eunos-paya-lebar', 'mixed', 'medium',
 'Mixed development with offices and homes',
 ARRAY['Office buildings', 'Shopping centers', 'Mixed development', 'Transport connectivity'],
 ARRAY['Office facilities', 'Shopping center services', 'Transport hubs'],
 'medium', ARRAY['Office workers', 'Residents', 'Commuters'],
 'D14 Singapore - Office-Friendly Halal Food in Paya Lebar & Eunos',
 'Convenient halal dining for D14 office workers and residents. Business lunch spots, shopping center food courts, and family restaurants.',
 ARRAY['D14 halal restaurants', 'Paya Lebar office halal', 'Eunos Muslim dining', 'business lunch halal']
),

('D15', 'East Coast / Marine Parade', 
 ARRAY['Marine Parade'],
 'Beachfront residential area with East Coast Park, seafood restaurants, recreational facilities, and family-friendly halal dining.',
 'd15-east-coast-marine-parade', 'residential', 'medium',
 'Beachfront living with recreational focus',
 ARRAY['East Coast Park', 'Beach activities', 'Seafood restaurants', 'Recreational facilities'],
 ARRAY['Park facilities', 'Beach services', 'Family amenities'],
 'medium', ARRAY['Families', 'Beach lovers', 'Recreation seekers'],
 'D15 Singapore - Beachfront Halal Dining at East Coast & Marine Parade',
 'Family-friendly halal restaurants near East Coast Park. Seafood options, beachfront dining, and recreational area Muslim services.',
 ARRAY['D15 halal seafood', 'East Coast Park halal', 'Marine Parade Muslim dining', 'beachfront halal food']
),

('D16', 'Bedok / Upper East Coast', 
 ARRAY['Bedok'],
 'Large residential town with affordable halal food, family amenities, shopping centers, and strong community networks.',
 'd16-bedok-upper-east-coast', 'residential', 'medium',
 'Large family-oriented residential town',
 ARRAY['Shopping centers', 'Family amenities', 'Community networks', 'Affordable living'],
 ARRAY['Community centers', 'Family services', 'Local mosques'],
 'high', ARRAY['Families', 'Budget-conscious diners', 'Community members'],
 'D16 Singapore - Affordable Family Halal Food in Bedok',
 'Budget-friendly halal dining in D16 Bedok. Family restaurants, food courts, and community-centered Muslim dining options.',
 ARRAY['D16 affordable halal', 'Bedok family restaurants', 'budget halal food', 'community Muslim dining']
),

('D17', 'Changi Airport / Changi Village', 
 ARRAY['Changi'],
 'Airport district with international halal dining, Changi Village seafood, duty-free shopping, and tourist-oriented services.',
 'd17-changi-airport-village', 'tourist', 'medium',
 'Airport vicinity with village charm',
 ARRAY['International airport', 'Duty-free shopping', 'Village seafood', 'Tourist facilities'],
 ARRAY['Airport prayer rooms', 'Tourist information', 'International services'],
 'high', ARRAY['Air travelers', 'Airport workers', 'Village visitors'],
 'D17 Singapore - Airport Halal Dining at Changi Airport & Village',
 'International halal cuisine at Changi Airport and village seafood. Traveler-friendly Muslim dining and airport services.',
 ARRAY['D17 airport halal', 'Changi Airport Muslim food', 'village halal seafood', 'traveler halal dining']
),

('D18', 'Pasir Ris / Tampines', 
 ARRAY['Pasir Ris', 'Tampines'],
 'Major regional center with extensive shopping, dining, entertainment, beaches, and comprehensive halal food ecosystem.',
 'd18-pasir-ris-tampines', 'residential', 'high',
 'Major regional hub with comprehensive amenities',
 ARRAY['Regional shopping', 'Entertainment venues', 'Beach access', 'Comprehensive amenities'],
 ARRAY['Regional services', 'Community facilities', 'Entertainment venues'],
 'very_high', ARRAY['Families', 'Entertainment seekers', 'Regional visitors'],
 'D18 Singapore - Comprehensive Halal Dining in Tampines & Pasir Ris',
 'Extensive halal food options in D18''s regional hub. Shopping center dining, entertainment venues, and family-friendly Muslim restaurants.',
 ARRAY['D18 halal food courts', 'Tampines Muslim dining', 'Pasir Ris halal restaurants', 'regional halal hub']
),

('D19', 'Hougang / Punggol / Sengkang', 
 ARRAY['Hougang', 'Punggol', 'Sengkang'],
 'Growing residential area with new developments, waterfront living, modern amenities, and expanding halal food scene.',
 'd19-hougang-punggol-sengkang', 'residential', 'medium',
 'Modern new towns with waterfront living',
 ARRAY['New developments', 'Waterfront areas', 'Modern amenities', 'Growing communities'],
 ARRAY['New community facilities', 'Modern services', 'Family amenities'],
 'medium', ARRAY['Young families', 'New residents', 'Modern lifestyle seekers'],
 'D19 Singapore - Modern Halal Dining in Hougang, Punggol & Sengkang',
 'Contemporary halal restaurants in D19''s new towns. Modern dining experiences, waterfront locations, and family-friendly Muslim services.',
 ARRAY['D19 modern halal', 'Punggol waterfront dining', 'Sengkang new town halal', 'contemporary Muslim restaurants']
),

('D20', 'Ang Mo Kio / Bishan / Thomson', 
 ARRAY['Ang Mo Kio', 'Bishan'],
 'Family-friendly residential area with excellent connectivity, parks, shopping centers, and diverse halal dining options.',
 'd20-ang-mo-kio-bishan-thomson', 'residential', 'medium',
 'Family-friendly with excellent connectivity',
 ARRAY['Excellent MRT access', 'Family parks', 'Shopping centers', 'Community facilities'],
 ARRAY['Family services', 'Community centers', 'Transport connectivity'],
 'high', ARRAY['Families', 'Commuters', 'Community-oriented residents'],
 'D20 Singapore - Family Halal Restaurants in Ang Mo Kio & Bishan',
 'Family-oriented halal dining in D20. Community restaurants, shopping center food courts, and family-friendly Muslim services.',
 ARRAY['D20 family halal', 'Ang Mo Kio Muslim dining', 'Bishan halal restaurants', 'family-friendly halal food']
),

-- WESTERN DISTRICTS (D21-D24)
('D21', 'Clementi Park / Upper Bukit Timah', 
 ARRAY['Clementi', 'Bukit Timah'],
 'University area blending academic life with nature, offering student-friendly halal food and family dining options.',
 'd21-clementi-park-upper-bukit-timah', 'mixed', 'low',
 'University area with nature access',
 ARRAY['University proximity', 'Nature reserves', 'Academic facilities', 'Student housing'],
 ARRAY['University services', 'Academic facilities', 'Student support'],
 'medium', ARRAY['Students', 'Academics', 'Nature lovers'],
 'D21 Singapore - University Halal Food in Clementi & Upper Bukit Timah',
 'Student-friendly halal dining in D21 university belt. Academic-focused restaurants, nature area dining, and student budget options.',
 ARRAY['D21 student halal', 'university area Muslim food', 'academic halal dining', 'nature area restaurants']
),

('D22', 'Boon Lay / Jurong / Tuas', 
 ARRAY['Boon Lay', 'Jurong East', 'Jurong West', 'Tuas'],
 'Major industrial and residential hub with extensive halal dining, shopping centers, entertainment, and worker-friendly options.',
 'd22-boon-lay-jurong-tuas', 'mixed', 'high',
 'Industrial hub with large residential population',
 ARRAY['Industrial zones', 'Major shopping centers', 'Entertainment venues', 'Worker amenities'],
 ARRAY['Industrial services', 'Worker facilities', 'Community centers'],
 'very_high', ARRAY['Industrial workers', 'Families', 'Entertainment seekers'],
 'D22 Singapore - Industrial Area Halal Food in Jurong & Boon Lay',
 'Extensive halal dining in D22 industrial hub. Worker-friendly restaurants, family dining, and major shopping center food courts.',
 ARRAY['D22 industrial halal', 'Jurong halal food courts', 'worker-friendly Muslim dining', 'Boon Lay halal restaurants']
),

('D23', 'Dairy Farm / Bukit Panjang / Choa Chu Kang', 
 ARRAY['Bukit Panjang', 'Choa Chu Kang'],
 'Family-oriented residential area with parks, community facilities, nature access, and neighborhood halal dining.',
 'd23-dairy-farm-bukit-panjang-choa-chu-kang', 'residential', 'low',
 'Family neighborhoods with nature access',
 ARRAY['Family parks', 'Nature reserves', 'Community facilities', 'Neighborhood spirit'],
 ARRAY['Community centers', 'Family services', 'Neighborhood facilities'],
 'medium', ARRAY['Families', 'Nature enthusiasts', 'Community members'],
 'D23 Singapore - Family Halal Dining in Bukit Panjang & Choa Chu Kang',
 'Community-centered halal restaurants in D23. Family dining, neighborhood eateries, and nature-friendly Muslim services.',
 ARRAY['D23 family halal', 'community Muslim dining', 'neighborhood halal food', 'nature area restaurants']
),

('D24', 'Lim Chu Kang / Tengah', 
 ARRAY['Lim Chu Kang', 'Tengah'],
 'Developing area with new smart town initiatives, agricultural heritage, and emerging halal food scene for new communities.',
 'd24-lim-chu-kang-tengah', 'developing', 'low',
 'New smart town development with rural heritage',
 ARRAY['Smart town features', 'Agricultural areas', 'New developments', 'Sustainable living'],
 ARRAY['New community facilities', 'Smart services', 'Sustainable amenities'],
 'low', ARRAY['New residents', 'Tech-savvy families', 'Sustainable living enthusiasts'],
 'D24 Singapore - Emerging Halal Scene in Tengah Smart Town',
 'New halal dining options in D24''s smart town development. Sustainable restaurants, tech-friendly services, and emerging Muslim community.',
 ARRAY['D24 smart town halal', 'Tengah new halal restaurants', 'sustainable Muslim dining', 'emerging halal community']
),

-- NORTHERN DISTRICTS (D25-D28)
('D25', 'Admiralty / Woodlands', 
 ARRAY['Woodlands'],
 'Northern hub near Malaysia border with extensive cross-border community, diverse halal dining, and international food options.',
 'd25-admiralty-woodlands', 'residential', 'high',
 'Border town with international character',
 ARRAY['Malaysia border', 'Cross-border community', 'International links', 'Regional connectivity'],
 ARRAY['Border facilities', 'International services', 'Cross-border amenities'],
 'very_high', ARRAY['Cross-border workers', 'International families', 'Border community'],
 'D25 Singapore - Cross-Border Halal Dining in Woodlands & Admiralty',
 'International halal cuisine in D25 border area. Cross-border flavors, Malaysian influences, and diverse Muslim community dining.',
 ARRAY['D25 border halal', 'Woodlands Malaysian food', 'cross-border Muslim dining', 'international halal cuisine']
),

('D26', 'Mandai / Upper Thomson', 
 ARRAY['Mandai'],
 'Nature and wildlife area with zoo proximity, limited but unique halal dining experiences for families and nature enthusiasts.',
 'd26-mandai-upper-thomson', 'nature', 'very_low',
 'Nature reserve with wildlife attractions',
 ARRAY['Wildlife parks', 'Nature reserves', 'Zoo attractions', 'Outdoor activities'],
 ARRAY['Tourist facilities', 'Nature services', 'Family amenities'],
 'low', ARRAY['Nature tourists', 'Families', 'Wildlife enthusiasts'],
 'D26 Singapore - Nature Area Halal Dining Near Mandai Zoo',
 'Family-friendly halal restaurants near D26 wildlife attractions. Nature-themed dining, zoo-adjacent options, and outdoor family meals.',
 ARRAY['D26 zoo halal', 'Mandai nature dining', 'wildlife area Muslim food', 'nature park halal restaurants']
),

('D27', 'Sembawang / Yishun', 
 ARRAY['Sembawang', 'Yishun'],
 'Northern residential towns with parks, beaches, community facilities, and diverse local halal food scene.',
 'd27-sembawang-yishun', 'residential', 'medium',
 'Northern towns with community focus',
 ARRAY['Community parks', 'Beach access', 'Local amenities', 'Neighborhood character'],
 ARRAY['Community facilities', 'Local services', 'Neighborhood amenities'],
 'medium', ARRAY['Local families', 'Community members', 'Beach visitors'],
 'D27 Singapore - Community Halal Dining in Sembawang & Yishun',
 'Local halal restaurants in D27 northern communities. Neighborhood dining, community eateries, and family-friendly Muslim services.',
 ARRAY['D27 community halal', 'Yishun local Muslim food', 'Sembawang neighborhood dining', 'northern town halal']
),

('D28', 'Seletar / Yio Chu Kang', 
 ARRAY['Seletar'],
 'Aerospace hub with limited but specialized halal dining options, mainly serving aviation industry and surrounding communities.',
 'd28-seletar-yio-chu-kang', 'industrial', 'very_low',
 'Aerospace and industrial area',
 ARRAY['Aerospace facilities', 'Industrial zones', 'Specialized services', 'Aviation industry'],
 ARRAY['Industrial facilities', 'Aviation services', 'Specialized amenities'],
 'low', ARRAY['Aviation workers', 'Industrial staff', 'Specialized professionals'],
 'D28 Singapore - Specialized Halal Dining in Seletar Aerospace Hub',
 'Industry-focused halal restaurants in D28 aerospace district. Aviation worker dining, industrial area options, and specialized Muslim services.',
 ARRAY['D28 aerospace halal', 'Seletar industrial Muslim food', 'aviation area halal dining', 'specialized industry restaurants']
)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  areas = EXCLUDED.areas,
  description = EXCLUDED.description,
  slug = EXCLUDED.slug,
  district_type = EXCLUDED.district_type,
  business_density = EXCLUDED.business_density,
  residential_character = EXCLUDED.residential_character,
  key_features = EXCLUDED.key_features,
  muslim_services = EXCLUDED.muslim_services,
  halal_dining_density = EXCLUDED.halal_dining_density,
  target_demographics = EXCLUDED.target_demographics,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  updated_at = now();

-- 📊 VERIFICATION QUERIES
-- Summary of property districts by type
SELECT 
  'Property Districts Summary' as status,
  COUNT(*) as total_districts,
  COUNT(*) FILTER (WHERE district_type = 'business') as business_districts,
  COUNT(*) FILTER (WHERE district_type = 'residential') as residential_districts,
  COUNT(*) FILTER (WHERE district_type = 'mixed') as mixed_districts,
  COUNT(*) FILTER (WHERE district_type = 'cultural') as cultural_districts,
  COUNT(*) FILTER (WHERE district_type = 'tourist') as tourist_districts,
  COUNT(*) FILTER (WHERE district_type = 'nature') as nature_districts,
  COUNT(*) FILTER (WHERE district_type = 'industrial') as industrial_districts,
  COUNT(*) FILTER (WHERE district_type = 'developing') as developing_districts
FROM property_districts;

-- Halal dining density analysis
SELECT 
  'Halal Dining Density Analysis' as analysis,
  halal_dining_density,
  COUNT(*) as district_count,
  string_agg(code, ', ' ORDER BY code) as districts
FROM property_districts 
GROUP BY halal_dining_density 
ORDER BY 
  CASE halal_dining_density 
    WHEN 'very_high' THEN 5
    WHEN 'high' THEN 4
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 2
    WHEN 'very_low' THEN 1
  END DESC;

-- High-priority districts for initial content creation
SELECT 
  'High Priority Property Districts' as category,
  code,
  name,
  halal_dining_density,
  district_type,
  array_length(target_demographics, 1) as target_groups
FROM property_districts 
WHERE halal_dining_density IN ('very_high', 'high')
ORDER BY 
  CASE halal_dining_density 
    WHEN 'very_high' THEN 2
    WHEN 'high' THEN 1
  END DESC, code;

-- ✅ SUCCESS MESSAGE
SELECT '🎉 SUCCESS: All 28 Singapore Property Districts (D01-D28) imported successfully!' as result;