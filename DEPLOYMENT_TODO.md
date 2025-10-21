# 📝 Deployment Tasks - Action Required

This document lists the deployment tasks that **require your action** before the application can go live.

## ⚠️ URGENT - Database Setup Required

### 1. Get Supabase Service Role Key

**Why needed**: Required for Netlify serverless functions to perform admin operations on the database.

**Steps**:
1. Log in to [Supabase Dashboard](https://app.supabase.com/)
2. Open your project: **halal-sg-connect**
3. Navigate to: **Settings** → **API**
4. Find section: **Project API keys**
5. Copy the **`service_role`** key (NOT the anon key)
   - Starts with `eyJ...`
   - Labeled as "secret" - keep it secure!
6. Add to Netlify environment variables as: `SUPABASE_SERVICE_ROLE_KEY`

**Security Note**: ⚠️ This key has admin access. Never commit it to Git or share publicly!

---

### 2. Run Database Migration

**Why needed**: Creates all necessary tables, policies, and initial data for the application.

**Steps**:
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Open your project: **halal-sg-connect**
3. Click on **SQL Editor** in the left sidebar
4. Click "+ New query"

**First Migration - Core Setup:**
1. Open file: `supabase/migrations/000_production_setup.sql` in your code editor
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor in Supabase
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for "Success. No rows returned" message

**Second Migration - Bulk Import:**
1. Open file: `supabase/migrations/001_bulk_import_schema.sql`
2. Copy the **entire contents**
3. Paste into a new query in SQL Editor
4. Click **Run**
5. Verify success

**Verification**:
- Navigate to **Table Editor** in Supabase
- You should see tables: `businesses`, `categories`, `districts`, `users`, etc.

---

## ✅ Optional but Recommended

### 3. Set up Sentry Error Monitoring

**Why recommended**: Track and fix errors in production before users report them.

**Steps**:
1. Sign up at [Sentry.io](https://sentry.io/) (free tier available)
2. Create new project → Select "React"
3. Copy your DSN (format: `https://[key]@[org].ingest.sentry.io/[project]`)
4. Add to Netlify environment variables as: `VITE_SENTRY_DSN`

**Note**: If you skip this, error monitoring will be disabled (app still works fine).

---

### 4. Create Storage Bucket for Images

**Why needed**: Enables users to upload business images.

**Steps**:
1. In Supabase Dashboard, click **Storage** in sidebar
2. Click **New bucket**
3. Bucket name: `business-assets`
4. Make it **public** (check the box)
5. Click **Create bucket**

**Set up policies**:
1. Click on the bucket name
2. Go to **Policies** tab
3. Add policy for public read:
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'business-assets');
   ```
4. Add policy for authenticated upload:
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'business-assets');
   ```

---

## 📋 Quick Checklist

Before marking deployment complete, verify:

**Database**:
- [ ] Service role key obtained and added to Netlify
- [ ] Migration 000_production_setup.sql executed successfully
- [ ] Migration 001_bulk_import_schema.sql executed successfully
- [ ] Tables visible in Supabase Table Editor

**Storage**:
- [ ] `business-assets` bucket created
- [ ] Bucket set to public
- [ ] Read and upload policies configured

**Monitoring** (Optional):
- [ ] Sentry project created (if using)
- [ ] Sentry DSN added to Netlify (if using)

**Deployment**:
- [ ] All environment variables configured in Netlify
- [ ] Site deployed successfully
- [ ] Can create a test account
- [ ] Can create a test business listing
- [ ] Can upload an image

---

## 🆘 Need Help?

If you encounter issues:

**Database issues**:
- Check SQL migration syntax
- Look for error messages in Supabase SQL Editor
- Verify PostGIS extension is enabled

**Netlify issues**:
- Check build logs
- Verify all environment variables are set
- Try rebuilding the site

**General questions**:
- Review `DEPLOYMENT.md` for detailed instructions
- Check Supabase docs: https://supabase.com/docs
- Check Netlify docs: https://docs.netlify.com/

---

**Ready to deploy?** Once all checkboxes are complete, your application will be fully functional in production! 🎉
