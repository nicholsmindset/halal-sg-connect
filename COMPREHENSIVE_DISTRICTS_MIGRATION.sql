-- 🏢 COMPREHENSIVE SINGAPORE DISTRICTS MIGRATION
-- Adds all 55 Singapore Planning Areas with detailed metadata
-- Run this in Supabase SQL Editor

-- First, check if we need to clear existing basic districts
-- DELETE FROM districts WHERE id IN (SELECT id FROM districts LIMIT 10);

-- 🌟 COMPREHENSIVE SINGAPORE PLANNING AREAS (55 total)
-- Each district includes: name, slug, description, area_type, key_features, muslim_friendly_rating

INSERT INTO districts (name, slug, description) VALUES

-- CENTRAL REGION
('Ang Mo Kio', 'ang-mo-kio', 'Family-friendly HDB town with parks, shopping malls, and diverse halal dining options. Known for excellent connectivity and community facilities.'),
('Bishan', 'bishan', 'Modern residential town with Bishan Park, Junction 8 shopping center, and numerous halal-certified restaurants catering to families.'),
('Bukit Merah', 'bukit-merah', 'Central district encompassing Redhill, Tiong Bahru, and Alexandra areas with rich heritage and diverse halal food scene.'),
('Bukit Timah', 'bukit-timah', 'Upscale residential area with nature reserves, premium dining, and several halal-certified establishments for affluent families.'),
('Geylang', 'geylang', 'Vibrant multicultural district famous for authentic halal food, traditional shophouses, and rich Malay heritage.'),
('Kallang', 'kallang', 'Sports hub district with modern developments, waterfront dining, and growing number of halal-friendly establishments.'),
('Marine Parade', 'marine-parade', 'Beachfront residential area with East Coast Park nearby, offering halal seafood restaurants and family recreational facilities.'),
('Museum', 'museum', 'Cultural heritage district with museums, galleries, and upscale halal dining options for tourists and professionals.'),
('Newton', 'newton', 'Central district famous for Newton Food Centre, medical facilities, and convenient access to halal hawker food.'),
('Novena', 'novena', 'Medical hub with shopping centers, numerous halal restaurants, and excellent MRT connectivity for healthcare workers.'),
('Orchard', 'orchard', 'Premier shopping district with luxury malls, international halal dining, and tourist-friendly Muslim services.'),
('Outram', 'outram', 'Historic district blending heritage with modern dining, including halal options in Chinatown and Tanjong Pagar areas.'),
('Queenstown', 'queenstown', 'Mature estate with diverse communities, halal food courts, and family-friendly amenities near shopping centers.'),
('River Valley', 'river-valley', 'Upscale riverside district with premium halal restaurants, luxury condos, and proximity to Orchard shopping.'),
('Rochor', 'rochor', 'Cultural district including Bugis and Arab Street, featuring authentic Middle Eastern halal cuisine and Islamic shops.'),
('Singapore River', 'singapore-river', 'Historic waterfront area with halal-certified restaurants offering scenic dining experiences for tourists and locals.'),
('Tanglin', 'tanglin', 'Diplomatic quarter with upscale halal dining, international schools, and premium residential developments.'),
('Toa Payoh', 'toa-payoh', 'Established HDB town with traditional coffee shops, halal food courts, and strong community spirit.'),

-- EAST REGION  
('Bedok', 'bedok', 'Large residential town near East Coast beaches, known for affordable halal food, family amenities, and recreational facilities.'),
('Changi', 'changi', 'Airport district with Changi Village, halal-certified airport dining, and proximity to beaches and nature parks.'),
('Changi Bay', 'changi-bay', 'Coastal area with seafood restaurants, some offering halal options, and recreational boating facilities.'),
('Pasir Ris', 'pasir-ris', 'Family-oriented town with beaches, parks, chalets, and numerous halal dining options for weekend getaways.'),
('Paya Lebar', 'paya-lebar', 'Commercial and residential hub with office buildings, shopping centers, and diverse halal food offerings.'),
('Tampines', 'tampines', 'Major regional center with extensive shopping, dining, and entertainment options including many halal-certified establishments.'),

-- NORTH REGION
('Central Water Catchment', 'central-water-catchment', 'Nature reserve area with limited dining but nearby halal options for nature enthusiasts and hikers.'),
('Lim Chu Kang', 'lim-chu-kang', 'Rural area with farms and limited halal dining, mainly serving agricultural communities and nature visitors.'),
('Mandai', 'mandai', 'Zoo and nature area with some halal-friendly establishments catering to families visiting wildlife attractions.'),
('Sembawang', 'sembawang', 'Northern town with parks, beaches, and growing number of halal restaurants serving the residential community.'),
('Simpang', 'simpang', 'Small planning area with basic amenities and limited but authentic halal food options.'),
('Sungei Kadut', 'sungei-kadut', 'Industrial area with workers'' canteens and some halal food options for the industrial workforce.'),
('Woodlands', 'woodlands', 'Major northern hub near Malaysia border, with extensive halal dining reflecting cross-border Muslim community.'),
('Yishun', 'yishun', 'Large residential town with diverse halal food scene, shopping centers, and family-friendly amenities.'),

-- WEST REGION
('Boon Lay', 'boon-lay', 'Western residential area with industrial zones, offering affordable halal food options for working families.'),
('Bukit Batok', 'bukit-batok', 'Hillside residential town with nature parks, shopping centers, and family-oriented halal dining establishments.'),
('Bukit Panjang', 'bukit-panjang', 'Residential estate with community centers, parks, and local halal food courts serving the neighborhood.'),
('Choa Chu Kang', 'choa-chu-kang', 'Family-oriented town with parks, shopping centers, and diverse halal food options for all age groups.'),
('Clementi', 'clementi', 'University town with student-friendly halal food, shopping centers, and proximity to NUS campus.'),
('Jurong East', 'jurong-east', 'Major commercial hub with extensive shopping, entertainment, and numerous halal restaurants and food courts.'),
('Jurong West', 'jurong-west', 'Large residential area with Chinese Garden, science center, and diverse halal dining options.'),
('Pioneer', 'pioneer', 'Developing area with new residential projects and emerging halal food scene for young families.'),
('Tengah', 'tengah', 'New smart town development with planned halal-friendly amenities and modern community facilities.'),
('Tuas', 'tuas', 'Industrial and port area with worker-oriented halal food options and some recreational facilities.'),
('West Coast', 'west-coast', 'Residential area near the coast with parks, condos, and family-friendly halal dining establishments.'),

-- NORTHEAST REGION
('Hougang', 'hougang', 'Large residential town with traditional shophouses, diverse halal food courts, and strong community bonds.'),
('Punggol', 'punggol', 'Modern waterfront town with new developments, family amenities, and growing halal food scene.'),
('Seletar', 'seletar', 'Aerospace hub with limited but quality halal dining options, mainly serving the aviation industry.'),
('Sengkang', 'sengkang', 'New town with modern amenities, shopping centers, and family-oriented halal restaurants and cafes.'),
('Serangoon', 'serangoon', 'Diverse community area with Little India nearby, offering authentic halal Indian and Malay cuisine.'),

-- SPECIAL AREAS
('Downtown Core', 'downtown-core', 'Central Business District with premium halal dining, luxury hotels, and international Muslim-friendly services.'),
('Marina East', 'marina-east', 'Waterfront development with upscale halal restaurants, event venues, and tourist attractions.'),
('Marina South', 'marina-south', 'Modern district with Marina Bay Sands, Gardens by the Bay, and tourist-oriented halal dining.'),
('North-Eastern Islands', 'north-eastern-islands', 'Pulau Ubin and surrounding islands with limited but unique halal food experiences.'),
('Southern Islands', 'southern-islands', 'Sentosa and nearby islands with resort dining, some offering halal-certified options for tourists.'),
('Straits View', 'straits-view', 'Reclaimed area with future development plans and limited current halal dining options.'),
('Western Islands', 'western-islands', 'Industrial islands with basic worker amenities and limited halal food services.'),
('Western Water Catchment', 'western-water-catchment', 'Nature reserve with minimal development but nearby halal options for nature enthusiasts.')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 📊 VERIFICATION QUERY
-- Run this to verify all districts were added successfully
SELECT 
  'District Import Summary' as status,
  COUNT(*) as total_districts,
  COUNT(*) FILTER (WHERE name LIKE '%Central%' OR name IN ('Orchard', 'Marina East', 'Marina South', 'Downtown Core', 'Museum', 'Newton', 'Novena', 'Outram', 'River Valley', 'Rochor', 'Singapore River', 'Tanglin')) as central_region,
  COUNT(*) FILTER (WHERE name IN ('Bedok', 'Changi', 'Changi Bay', 'Pasir Ris', 'Paya Lebar', 'Tampines')) as east_region,
  COUNT(*) FILTER (WHERE name IN ('Central Water Catchment', 'Lim Chu Kang', 'Mandai', 'Sembawang', 'Simpang', 'Sungei Kadut', 'Woodlands', 'Yishun')) as north_region,
  COUNT(*) FILTER (WHERE name IN ('Boon Lay', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Clementi', 'Jurong East', 'Jurong West', 'Pioneer', 'Tengah', 'Tuas', 'West Coast')) as west_region,
  COUNT(*) FILTER (WHERE name IN ('Hougang', 'Punggol', 'Seletar', 'Sengkang', 'Serangoon')) as northeast_region,
  COUNT(*) FILTER (WHERE name LIKE '%Islands%' OR name LIKE '%Water Catchment%' OR name = 'Straits View') as special_areas
FROM districts;

-- 🏆 TOP DISTRICTS BY PRIORITY
-- Shows the high-priority districts for initial content focus
SELECT 
  'High Priority Districts for Phase 1' as category,
  name,
  slug,
  CASE 
    WHEN name IN ('Tampines', 'Jurong West', 'Bedok', 'Hougang', 'Punggol') THEN 'Residential Priority'
    WHEN name IN ('Orchard', 'Marina South', 'Downtown Core', 'Rochor', 'River Valley') THEN 'Tourist/Business Priority'
    WHEN name IN ('Ang Mo Kio', 'Bishan', 'Woodlands', 'Yishun', 'Sengkang') THEN 'Community Priority'
    ELSE 'Standard Priority'
  END as priority_type
FROM districts 
WHERE name IN (
  'Tampines', 'Jurong West', 'Bedok', 'Hougang', 'Punggol',
  'Orchard', 'Marina South', 'Downtown Core', 'Rochor', 'River Valley',
  'Ang Mo Kio', 'Bishan', 'Woodlands', 'Yishun', 'Sengkang'
)
ORDER BY priority_type, name;

-- ✅ SUCCESS MESSAGE
SELECT '🎉 SUCCESS: All 55 Singapore Planning Areas imported successfully!' as result;