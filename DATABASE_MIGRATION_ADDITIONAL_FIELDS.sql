-- Database Migration: Add opening_hours and social_media fields
-- Description: Adds JSON fields to store business opening hours and social media links
-- Date: 2025-11-06
-- Status: READY TO APPLY

-- Add opening_hours column to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS opening_hours JSONB;

-- Add social_media column to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS social_media JSONB;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_opening_hours ON businesses USING GIN (opening_hours);
CREATE INDEX IF NOT EXISTS idx_businesses_social_media ON businesses USING GIN (social_media);

-- Add comments to describe the columns
COMMENT ON COLUMN businesses.opening_hours IS 'Business operating hours by day of week. Format: {"monday": {"open": "09:00", "close": "21:00", "closed": false}, ...}';
COMMENT ON COLUMN businesses.social_media IS 'Social media links. Format: {"instagram": "@username", "facebook": "page_url", "tiktok": "@username"}';

-- Sample data format for opening_hours:
-- {
--   "monday": {"open": "09:00", "close": "21:00", "closed": false},
--   "tuesday": {"open": "09:00", "close": "21:00", "closed": false},
--   "wednesday": {"open": "09:00", "close": "21:00", "closed": false},
--   "thursday": {"open": "09:00", "close": "21:00", "closed": false},
--   "friday": {"open": "09:00", "close": "21:00", "closed": false},
--   "saturday": {"open": "10:00", "close": "22:00", "closed": false},
--   "sunday": {"open": "10:00", "close": "20:00", "closed": false}
-- }

-- Sample data format for social_media:
-- {
--   "instagram": "@businessname",
--   "facebook": "https://facebook.com/businessname",
--   "tiktok": "@businessname"
-- }

-- AFTER APPLYING THIS MIGRATION:
-- Update src/integrations/supabase/types.ts to include these fields:
--
-- businesses: {
--   Row: {
--     ...existing fields...
--     opening_hours: Record<string, {open: string, close: string, closed?: boolean}> | null
--     social_media: {instagram?: string, facebook?: string, tiktok?: string} | null
--   }
--   Insert: {
--     ...existing fields...
--     opening_hours?: Record<string, {open: string, close: string, closed?: boolean}> | null
--     social_media?: {instagram?: string, facebook?: string, tiktok?: string} | null
--   }
--   Update: {
--     ...existing fields...
--     opening_hours?: Record<string, {open: string, close: string, closed?: boolean}> | null
--     social_media?: {instagram?: string, facebook?: string, tiktok?: string} | null
--   }
-- }
--
-- Then in src/components/forms/ListingForm.tsx, uncomment lines 296-299:
-- opening_hours: data.openingHours,
-- social_media: data.socialMedia,
