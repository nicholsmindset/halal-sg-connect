-- 🔍 SIMPLE DATABASE CHECK
-- Copy this entire query and paste into Supabase SQL Editor, then click RUN

-- Step 1: Check if main tables exist
SELECT 'Tables Check' as test_name, 
       COUNT(*) as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('categories', 'districts', 'businesses');

-- Step 2: Count records in each table
SELECT 'Districts Count' as test_name, COUNT(*) as result FROM districts
UNION ALL
SELECT 'Categories Count' as test_name, COUNT(*) as result FROM categories  
UNION ALL
SELECT 'Businesses Count' as test_name, COUNT(*) as result FROM businesses;

-- Step 3: Show sample data to verify
SELECT 'Sample District' as test_name, name as result FROM districts LIMIT 1
UNION ALL
SELECT 'Sample Category' as test_name, name as result FROM categories LIMIT 1
UNION ALL  
SELECT 'Sample Business' as test_name, name as result FROM businesses LIMIT 1;