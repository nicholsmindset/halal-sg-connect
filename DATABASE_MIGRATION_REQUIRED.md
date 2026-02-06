# Business Listing System Setup

## Required Database Migration

The `businesses` table is missing a crucial field to link businesses to their owners. Run this SQL migration in Supabase SQL Editor:

```sql
-- Add owner_id column to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);

-- Update is_business_owner function to use owner_id
CREATE OR REPLACE FUNCTION is_business_owner(_business_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses
    WHERE id = _business_id AND owner_id = _user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS (Row Level Security) on businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all published businesses
CREATE POLICY "Anyone can view published businesses"
ON businesses FOR SELECT
USING (verification_status = 'approved' OR verification_status IS NULL);

-- Policy: Users can insert their own businesses
CREATE POLICY "Users can create their own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own businesses
CREATE POLICY "Users can update their own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = owner_id);

-- Policy: Users can delete their own businesses
CREATE POLICY "Users can delete their own businesses"
ON businesses FOR DELETE
USING (auth.uid() = owner_id);

-- Policy: Admins can do anything (optional - add admin role check)
-- You'll need to add an admin role to user metadata first
```

## Storage Bucket Setup

Create a storage bucket in Supabase for business images:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `business-assets`
3. Set it to **Public** bucket
4. Add storage policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload business images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-assets');

-- Allow public access to view images
CREATE POLICY "Anyone can view business images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-assets');

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own business images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'business-assets');
```

## After Running Migration

1. Update Supabase types: Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts`
2. The `owner_id` field will now be available in TypeScript types
3. All RLS policies will be active
4. Business listing CRUD operations will work properly

## Testing the Migration

After running the SQL above, test:

```sql
-- Test 1: Insert a business (replace with real user ID from auth.users)
INSERT INTO businesses (name, slug, owner_id)
VALUES ('Test Business', 'test-business', 'YOUR_USER_ID');

-- Test 2: Check if is_business_owner works
SELECT is_business_owner('BUSINESS_ID', 'USER_ID');

-- Test 3: Verify RLS policies
-- Try selecting as anonymous user (should only see approved businesses)
-- Try updating another user's business (should fail)
```
