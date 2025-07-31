-- 🔍 Database Verification Script
-- Run this in Supabase SQL Editor to check if everything was created correctly

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('categories', 'districts', 'businesses', 'import_jobs', 'seo_pages')
ORDER BY table_name;

-- Check if districts were inserted
SELECT 'Districts Count' as check_type, COUNT(*) as count FROM districts
UNION ALL
SELECT 'Categories Count' as check_type, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Businesses Count' as check_type, COUNT(*) as count FROM businesses;

-- Show sample data
SELECT 'Sample Districts:' as info, name, slug, region FROM districts LIMIT 5;

-- Show sample categories
SELECT 'Sample Categories:' as info, name, slug, display_order FROM categories LIMIT 5;