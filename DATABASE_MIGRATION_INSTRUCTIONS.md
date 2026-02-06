# Database Migration Instructions

## Opening Hours and Social Media Fields

**Status:** Ready to Apply
**Date:** 2025-11-25
**Priority:** HIGH - Enables saving of opening hours and social media data

---

## What This Migration Does

This migration adds two new JSONB columns to the `businesses` table:
- `opening_hours` - Store business operating hours by day of week
- `social_media` - Store social media links (Instagram, Facebook, TikTok)

**Impact:**
- ✅ No data loss - all existing data is preserved
- ✅ No downtime required
- ✅ Backward compatible - existing code continues to work
- ✅ Code changes already implemented and tested

---

## Prerequisites

Before applying this migration:
1. ✅ Code changes completed (TypeScript types updated, ListingForm updated)
2. ✅ TypeScript compilation passed with no errors
3. ⚠️ **Database migration SQL needs to be applied**

---

## How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com
   - Navigate to your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration SQL**
   - Open `DATABASE_MIGRATION_ADDITIONAL_FIELDS.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Review the SQL**
   ```sql
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
   ```

5. **Run the Migration**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for success message

6. **Verify Success**
   - Should see "Success. No rows returned"
   - Check the "Tables" section to verify new columns exist

### Option 2: Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd /home/user/halal-sg-connect

# Link to your Supabase project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push

# Or apply the specific SQL file
supabase db execute -f DATABASE_MIGRATION_ADDITIONAL_FIELDS.sql
```

---

## Verification Steps

After applying the migration:

### 1. Verify Columns Exist

Run this SQL in Supabase SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'businesses'
AND column_name IN ('opening_hours', 'social_media');
```

**Expected Output:**
```
column_name     | data_type | is_nullable
----------------|-----------|------------
opening_hours   | jsonb     | YES
social_media    | jsonb     | YES
```

### 2. Verify Indexes Exist

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'businesses'
AND indexname IN ('idx_businesses_opening_hours', 'idx_businesses_social_media');
```

**Expected Output:**
```
indexname
---------------------------
idx_businesses_opening_hours
idx_businesses_social_media
```

### 3. Test with Sample Data

```sql
-- Insert test data
UPDATE businesses
SET
  opening_hours = '{
    "monday": {"open": "09:00", "close": "21:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "21:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "21:00", "closed": false},
    "thursday": {"open": "09:00", "close": "21:00", "closed": false},
    "friday": {"open": "09:00", "close": "21:00", "closed": false},
    "saturday": {"open": "10:00", "close": "22:00", "closed": false},
    "sunday": {"open": "10:00", "close": "20:00", "closed": false}
  }'::jsonb,
  social_media = '{
    "instagram": "@testbusiness",
    "facebook": "https://facebook.com/testbusiness",
    "tiktok": "@testbusiness"
  }'::jsonb
WHERE id = 'YOUR_TEST_BUSINESS_ID'
LIMIT 1;

-- Query to verify
SELECT name, opening_hours, social_media
FROM businesses
WHERE id = 'YOUR_TEST_BUSINESS_ID';
```

---

## Testing the Feature

After migration is applied:

### 1. Create New Business
1. Login to the application
2. Go to "Create New Listing"
3. Fill in all fields including opening hours and social media
4. Click "Create Listing"
5. ✅ Check: Data saves successfully
6. ✅ Check: View listing shows opening hours and social media

### 2. Edit Existing Business
1. Go to Dashboard → Your Listings
2. Click "Edit" on a listing
3. ✅ Check: Opening hours and social media fields load (if previously saved)
4. Update the values
5. Click "Update Listing"
6. ✅ Check: Changes persist after refresh

### 3. Save as Draft
1. Create new listing
2. Fill in opening hours only
3. Click "Save as Draft"
4. ✅ Check: Draft saves successfully with opening hours

---

## Data Format Examples

### Opening Hours Format

```json
{
  "monday": {"open": "09:00", "close": "21:00", "closed": false},
  "tuesday": {"open": "09:00", "close": "21:00", "closed": false},
  "wednesday": {"open": "09:00", "close": "21:00", "closed": false},
  "thursday": {"open": "09:00", "close": "21:00", "closed": false},
  "friday": {"open": "09:00", "close": "21:00", "closed": false},
  "saturday": {"open": "10:00", "close": "22:00", "closed": false},
  "sunday": {"open": "10:00", "close": "20:00", "closed": true}
}
```

**For closed days:**
```json
{
  "sunday": {"closed": true}
}
```

### Social Media Format

```json
{
  "instagram": "@businessname",
  "facebook": "https://facebook.com/businessname",
  "tiktok": "@businessname"
}
```

**All fields optional:**
```json
{
  "instagram": "@businessname"
}
```

---

## Rollback Plan

If you need to rollback this migration:

```sql
-- Remove indexes
DROP INDEX IF EXISTS idx_businesses_opening_hours;
DROP INDEX IF EXISTS idx_businesses_social_media;

-- Remove columns (⚠️ This will delete all data in these columns!)
ALTER TABLE businesses DROP COLUMN IF EXISTS opening_hours;
ALTER TABLE businesses DROP COLUMN IF EXISTS social_media;
```

**Warning:** Rollback will permanently delete all opening hours and social media data. Only rollback if absolutely necessary.

---

## Post-Migration Steps

After successfully applying the migration:

1. ✅ Test creating new business with opening hours
2. ✅ Test editing existing business
3. ✅ Test save as draft functionality
4. ✅ Update QA_QUICK_START.md to remove limitation warning
5. ✅ Update QA_TESTING_GUIDE.md to remove limitation section
6. ✅ Notify QA team that feature is ready for testing

---

## Troubleshooting

### Error: "column already exists"
**Cause:** Migration was already applied
**Solution:** This is safe to ignore. The `IF NOT EXISTS` clause prevents errors.

### Error: "permission denied"
**Cause:** Insufficient database permissions
**Solution:** Ensure you're logged in as the Supabase project owner or have ALTER TABLE permissions.

### Error: "relation does not exist"
**Cause:** `businesses` table not found
**Solution:** Verify you're connected to the correct database. Check table name is correct.

### Data Not Saving
**Cause:** Row Level Security (RLS) policies may be blocking
**Solution:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'businesses';

-- Temporarily disable RLS for testing (re-enable after!)
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
```

---

## Success Criteria

Migration is successful when:
- ✅ SQL executes without errors
- ✅ Columns `opening_hours` and `social_media` exist in businesses table
- ✅ Indexes created successfully
- ✅ TypeScript compilation passes
- ✅ Application runs without errors
- ✅ Users can create/edit businesses with opening hours
- ✅ Data persists after saving
- ✅ Edit form loads existing opening hours and social media

---

## Questions or Issues?

If you encounter any issues:
1. Check the Supabase dashboard logs
2. Review the SQL error message
3. Verify you're using the correct database
4. Ensure you have the latest code from branch `claude/test-routing-functionality-011CUo5cPuy7Xan96DusKDbK`

---

**Migration Ready to Apply!** 🚀

Last updated: 2025-11-25
Branch: claude/test-routing-functionality-011CUo5cPuy7Xan96DusKDbK
Commit: Latest (opening_hours and social_media implementation)
