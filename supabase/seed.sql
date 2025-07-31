-- Seed Data for Halal SG Connect
-- This file contains initial data for categories and districts

-- Insert Singapore Districts
INSERT INTO districts (name, slug, description, region, postal_sectors) VALUES
('Orchard', 'orchard', 'Singapore''s premier shopping and dining district with luxury malls and international cuisine.', 'Central', ARRAY[23, 24]),
('Marina Bay', 'marina-bay', 'Modern financial district with iconic landmarks like Marina Bay Sands and Gardens by the Bay.', 'Central', ARRAY[1, 2, 3, 4, 5, 6]),
('Chinatown', 'chinatown', 'Historic cultural district with traditional shophouses, temples, and authentic local food.', 'Central', ARRAY[5, 6]),
('Little India', 'little-india', 'Vibrant Indian cultural precinct with colorful shops, restaurants, and traditional goods.', 'Central', ARRAY[20, 21]),
('Clarke Quay', 'clarke-quay', 'Historic riverside entertainment district with restaurants, bars, and nightlife.', 'Central', ARRAY[17, 18, 19]),
('Raffles Place', 'raffles-place', 'Singapore''s central business district with office towers and dining options.', 'Central', ARRAY[4, 5]),
('Bugis', 'bugis', 'Shopping and entertainment district popular with young locals and tourists.', 'Central', ARRAY[18, 19, 20]),
('Tanjong Pagar', 'tanjong-pagar', 'Historic district transformed into a modern business and dining hub.', 'Central', ARRAY[8, 9]),
('Somerset', 'somerset', 'Youth-oriented shopping district with trendy malls and eateries.', 'Central', ARRAY[22, 23]),
('Dhoby Ghaut', 'dhoby-ghaut', 'Arts and culture district home to museums, theaters, and educational institutions.', 'Central', ARRAY[18, 19]),

-- East Region
('Paya Lebar', 'paya-lebar', 'Developing commercial hub in the east with offices, malls, and food centers.', 'East', ARRAY[40, 41, 42]),
('Tampines', 'tampines', 'Major residential town with shopping malls, hawker centers, and family amenities.', 'East', ARRAY[52, 53]),
('Bedok', 'bedok', 'Mature residential estate with traditional markets, food courts, and local eateries.', 'East', ARRAY[46, 47, 48, 49]),
('Pasir Ris', 'pasir-ris', 'Family-friendly town near the beach with parks, malls, and seafood restaurants.', 'East', ARRAY[51, 52]),
('Changi', 'changi', 'Coastal area home to Singapore''s airport, beaches, and fresh seafood dining.', 'East', ARRAY[49, 50, 51]),
('Katong', 'katong', 'Historic Peranakan district famous for laksa and traditional shophouses.', 'East', ARRAY[42, 43, 44, 45]),
('Marine Parade', 'marine-parade', 'Beachfront residential area with seafood restaurants and recreational facilities.', 'East', ARRAY[44, 45]),
('Geylang', 'geylang', 'Cultural melting pot famous for authentic local food, especially late-night dining.', 'East', ARRAY[38, 39, 40, 41]),

-- North Region
('Woodlands', 'woodlands', 'Major residential town near Malaysia border with shopping centers and food courts.', 'North', ARRAY[73, 74, 75, 76, 77]),
('Yishun', 'yishun', 'Large residential town with diverse dining options and community facilities.', 'North', ARRAY[76, 77]),
('Ang Mo Kio', 'ang-mo-kio', 'Established residential town with traditional coffee shops and modern amenities.', 'North', ARRAY[56, 57, 58, 59, 60]),
('Sembawang', 'sembawang', 'Quiet residential area with parks, local eateries, and family-friendly amenities.', 'North', ARRAY[75, 76]),
('Admiralty', 'admiralty', 'Growing residential area with new shopping centers and dining options.', 'North', ARRAY[75, 76]),

-- West Region
('Jurong East', 'jurong-east', 'Major commercial hub in the west with shopping malls, offices, and diverse dining.', 'West', ARRAY[60, 61, 62, 63, 64, 65, 66]),
('Clementi', 'clementi', 'University town with student-friendly eateries and shopping centers.', 'West', ARRAY[12, 13]),
('Bukit Batok', 'bukit-batok', 'Residential town with nature parks, food centers, and family restaurants.', 'West', ARRAY[65, 66]),
('Choa Chu Kang', 'choa-chu-kang', 'Mature residential estate with traditional coffee shops and local food.', 'West', ARRAY[68, 69]),
('Tuas', 'tuas', 'Industrial area with worker-friendly eateries and affordable dining options.', 'West', ARRAY[63, 64]),
('Boon Lay', 'boon-lay', 'Residential area with shopping centers and diverse food options.', 'West', ARRAY[64, 65]),

-- South Region
('Harbourfront', 'harbourfront', 'Waterfront district with shopping, dining, and cruise terminal.', 'South', ARRAY[9, 10]),
('Tiong Bahru', 'tiong-bahru', 'Trendy heritage district with artisan cafes, bistros, and boutique shops.', 'South', ARRAY[16, 17]),
('Redhill', 'redhill', 'Traditional residential area with local food centers and coffee shops.', 'South', ARRAY[15, 16]),
('Bukit Merah', 'bukit-merah', 'Central residential area with diverse dining and shopping options.', 'South', ARRAY[15, 16]),
('Alexandra', 'alexandra', 'Lifestyle hub with trendy restaurants, cafes, and recreational facilities.', 'South', ARRAY[11, 12]);

-- Insert Main Categories
INSERT INTO categories (name, slug, icon, description, keywords) VALUES
('Restaurants', 'restaurants', '🍽️', 'Full-service dining establishments offering halal cuisine from around the world.', ARRAY['restaurant', 'dining', 'halal food', 'cuisine', 'meal']),
('Cafes & Bakeries', 'cafes-bakeries', '☕', 'Coffee shops, tea houses, bakeries, and casual dining spots with halal options.', ARRAY['cafe', 'coffee', 'bakery', 'pastry', 'beverages', 'dessert']),
('Fast Food & Takeaway', 'fast-food-takeaway', '🍔', 'Quick service restaurants, food courts, and takeaway options.', ARRAY['fast food', 'takeaway', 'delivery', 'quick meal', 'food court']),
('Groceries & Markets', 'groceries-markets', '🛒', 'Halal grocery stores, supermarkets, and traditional wet markets.', ARRAY['grocery', 'supermarket', 'halal groceries', 'fresh produce', 'market']),
('Butcheries & Meat Suppliers', 'butcheries-meat', '🥩', 'Halal butcher shops, meat suppliers, and specialty meat products.', ARRAY['butcher', 'halal meat', 'fresh meat', 'supplier', 'wholesale']),
('Catering Services', 'catering', '🍱', 'Professional catering companies and services for events and functions.', ARRAY['catering', 'event catering', 'corporate catering', 'wedding catering', 'buffet']),
('Beauty & Wellness', 'beauty-wellness', '💆', 'Halal-compliant beauty services, spas, and wellness centers.', ARRAY['beauty', 'spa', 'wellness', 'halal beauty', 'massage', 'skincare']),
('Financial Services', 'financial-services', '💰', 'Islamic banking, takaful, and Shariah-compliant financial services.', ARRAY['islamic banking', 'takaful', 'halal investment', 'shariah compliant', 'finance']),
('Education & Training', 'education-training', '📚', 'Islamic education, madrasah, tuition centers, and skill training.', ARRAY['islamic education', 'madrasah', 'tuition', 'religious classes', 'training']),
('Travel & Tourism', 'travel-tourism', '✈️', 'Halal-friendly travel agencies, tours, and accommodation services.', ARRAY['halal travel', 'muslim friendly', 'travel agency', 'umrah', 'hajj', 'tourism']),
('Professional Services', 'professional-services', '💼', 'Legal, accounting, consultancy, and other professional services.', ARRAY['legal', 'accounting', 'consultancy', 'professional', 'business services']),
('Retail & Shopping', 'retail-shopping', '🛍️', 'Clothing, accessories, electronics, and general retail with halal considerations.', ARRAY['retail', 'shopping', 'clothing', 'accessories', 'electronics', 'modest wear']),
('Health & Medical', 'health-medical', '🏥', 'Medical centers, clinics, and healthcare services with Islamic considerations.', ARRAY['medical', 'clinic', 'healthcare', 'hospital', 'doctor', 'dental']),
('Automotive Services', 'automotive', '🚗', 'Car repair, maintenance, and automotive services.', ARRAY['car repair', 'automotive', 'workshop', 'maintenance', 'vehicle services']),
('Home & Garden', 'home-garden', '🏠', 'Home improvement, furniture, gardening, and household services.', ARRAY['home improvement', 'furniture', 'gardening', 'household', 'renovation']);

-- Insert Subcategories
INSERT INTO categories (name, slug, parent_id, description, keywords) VALUES
-- Restaurant subcategories
('Chinese Cuisine', 'chinese', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal Chinese restaurants and zi char stalls.', ARRAY['chinese food', 'zi char', 'dim sum', 'noodles', 'rice dishes']),
('Indian Cuisine', 'indian', (SELECT id FROM categories WHERE slug = 'restaurants'), 'North and South Indian halal restaurants.', ARRAY['indian food', 'curry', 'biryani', 'tandoori', 'roti', 'naan']),
('Malay Cuisine', 'malay', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Traditional Malay and Nusantara cuisine.', ARRAY['malay food', 'nasi lemak', 'rendang', 'satay', 'mee rebus']),
('Middle Eastern', 'middle-eastern', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Arab, Turkish, and Middle Eastern halal cuisine.', ARRAY['arab food', 'turkish', 'kebab', 'shawarma', 'mandi', 'biryani']),
('Western Cuisine', 'western', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal Western restaurants and steakhouses.', ARRAY['western food', 'steak', 'pasta', 'pizza', 'burger', 'grill']),
('Thai Cuisine', 'thai', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal Thai restaurants and street food.', ARRAY['thai food', 'tom yum', 'pad thai', 'green curry', 'mango sticky rice']),
('Indonesian Cuisine', 'indonesian', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Indonesian halal restaurants and Padang cuisine.', ARRAY['indonesian food', 'padang', 'gudeg', 'soto', 'gado-gado']),
('Japanese Cuisine', 'japanese', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal Japanese restaurants and sushi bars.', ARRAY['japanese food', 'sushi', 'ramen', 'teriyaki', 'bento', 'tempura']),
('Korean Cuisine', 'korean', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal Korean restaurants and BBQ.', ARRAY['korean food', 'bbq', 'kimchi', 'bulgogi', 'bibimbap', 'korean fried chicken']),
('International Buffet', 'buffet', (SELECT id FROM categories WHERE slug = 'restaurants'), 'Halal international buffet restaurants.', ARRAY['buffet', 'international', 'all you can eat', 'variety', 'lunch buffet']),

-- Cafe subcategories
('Coffee Shops', 'coffee-shops', (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 'Traditional coffee shops and modern cafes.', ARRAY['coffee', 'kopi', 'latte', 'espresso', 'cafe']),
('Bakeries', 'bakeries', (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 'Halal bakeries and pastry shops.', ARRAY['bakery', 'bread', 'pastry', 'cake', 'cookies', 'danish']),
('Dessert Shops', 'dessert', (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 'Ice cream, desserts, and sweet treats.', ARRAY['dessert', 'ice cream', 'gelato', 'cake', 'pastry', 'sweets']),
('Tea Houses', 'tea-houses', (SELECT id FROM categories WHERE slug = 'cafes-bakeries'), 'Traditional and modern tea houses.', ARRAY['tea', 'bubble tea', 'milk tea', 'traditional tea', 'herbal tea']);

-- Fast food subcategories
('Burger Chains', 'burger-chains', (SELECT id FROM categories WHERE slug = 'fast-food-takeaway'), 'Halal burger chains and fast food outlets.', ARRAY['burger', 'fast food', 'fries', 'chicken burger', 'beef burger']),
('Fried Chicken', 'fried-chicken', (SELECT id FROM categories WHERE slug = 'fast-food-takeaway'), 'Halal fried chicken restaurants and chains.', ARRAY['fried chicken', 'crispy chicken', 'chicken wings', 'chicken rice']),
('Pizza & Italian Fast Food', 'pizza', (SELECT id FROM categories WHERE slug = 'fast-food-takeaway'), 'Halal pizza outlets and Italian fast food.', ARRAY['pizza', 'italian fast food', 'pasta', 'garlic bread']),
('Asian Fast Food', 'asian-fast-food', (SELECT id FROM categories WHERE slug = 'fast-food-takeaway'), 'Asian fast food chains and quick meals.', ARRAY['asian fast food', 'noodles', 'rice bowl', 'stir fry']),
('Food Courts', 'food-courts', (SELECT id FROM categories WHERE slug = 'fast-food-takeaway'), 'Food courts and hawker centers with halal stalls.', ARRAY['food court', 'hawker center', 'kopitiam', 'food stall']);

-- Update business count for categories (this would normally be done via triggers)
UPDATE categories SET business_count = 0 WHERE business_count IS NULL;

-- Insert sample halal certification bodies
INSERT INTO districts (name, slug, description, region) VALUES
('MUIS', 'muis', 'Majlis Ugama Islam Singapura - Singapore''s Islamic Religious Council', 'Certification'),
('JAKIM', 'jakim', 'Department of Islamic Development Malaysia', 'Certification'),
('MUI', 'mui', 'Indonesian Ulema Council', 'Certification'),
('IFANCA', 'ifanca', 'Islamic Food and Nutrition Council of America', 'Certification')
ON CONFLICT (slug) DO NOTHING;