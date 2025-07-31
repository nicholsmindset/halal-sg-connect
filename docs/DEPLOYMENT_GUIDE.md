# 🚀 Halal SG Connect - Production Deployment Guide

## 📋 Prerequisites

- GitHub repository connected to Netlify
- Supabase account
- Domain name (optional but recommended)

## 🔧 Step 1: Supabase Production Setup

### 1.1 Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region (Asia-Pacific/Singapore recommended)
4. Set project name: `halal-sg-connect-prod`
5. Set a strong database password
6. Wait for project creation (~2 minutes)

### 1.2 Get Your Credentials
After project creation, go to **Settings > API**:
- **Project URL**: `https://[your-project-id].supabase.co`
- **anon/public key**: `eyJ...` (starts with eyJ)
- **service_role key**: `eyJ...` (keep this secret!)

### 1.3 Run Database Migration
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/000_production_setup.sql`
3. Click "Run" to execute the migration
4. Verify tables are created in the **Table Editor**

## 🌐 Step 2: Netlify Configuration

### 2.1 Environment Variables
In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```bash
# Required Supabase Configuration
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_URL=https://[your-project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# App Configuration
VITE_APP_ENV=production
NODE_ENV=production
VITE_APP_URL=https://[your-site-name].netlify.app
```

### 2.2 Build Settings (Auto-configured)
Netlify should auto-detect these settings:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### 2.3 Deploy Settings
- **Branch to deploy**: `main`
- **Auto deploy**: Enabled (deploys on every push to main)

## 🔒 Step 3: Database Security Configuration

### 3.1 Row Level Security (RLS)
The migration script automatically enables RLS. Verify in Supabase:
1. Go to **Authentication > Policies**
2. Confirm policies are created for all tables
3. Test that public users can only read verified businesses

### 3.2 User Roles Setup
1. Go to **Authentication > Users**
2. Create an admin user account
3. In **SQL Editor**, run:
```sql
-- Set admin role for your user
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

## 📊 Step 4: Initial Data Setup

### 4.1 Verify Seed Data
Check that initial data was created:
- **Districts**: 10 Singapore districts should be populated
- **Categories**: 10 business categories should be available

### 4.2 Create Sample Business (Optional)
Use the admin interface at `/admin/import` to upload a CSV with sample businesses, or manually add via SQL:

```sql
INSERT INTO businesses (name, slug, description, address, district, category_ids, halal_certified, verification_status, is_active)
VALUES (
  'Sample Halal Restaurant',
  'sample-halal-restaurant',
  'A delicious halal restaurant serving authentic cuisine',
  '123 Orchard Road, Singapore 238858',
  'Orchard',
  ARRAY[(SELECT id FROM categories WHERE slug = 'restaurants')],
  true,
  'verified',
  true
);
```

## ✅ Step 5: Deployment Verification

### 5.1 Test Deployment
1. Push your code to the `main` branch
2. Check Netlify build logs for success
3. Visit your live site: `https://[your-site-name].netlify.app`

### 5.2 Functionality Tests
- [ ] Homepage loads correctly
- [ ] Business listings page works
- [ ] Search functionality works
- [ ] Admin login works (`/admin`)
- [ ] Import functionality works
- [ ] SEO pages generate (`/category/restaurants`)
- [ ] Sitemap accessible (`/sitemap.xml`)

### 5.3 SEO Setup
1. **Google Search Console**:
   - Add your site
   - Submit sitemap: `https://your-domain.com/sitemap.xml`
   
2. **Bing Webmaster Tools**:
   - Add your site
   - Submit sitemap

## 🌍 Step 6: Custom Domain (Optional)

### 6.1 Configure Domain in Netlify
1. Go to **Site settings > Domain management**
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### 6.2 SSL Certificate
Netlify automatically provisions SSL certificates for custom domains.

## 📈 Step 7: Monitoring & Analytics

### 7.1 Google Analytics (Optional)
1. Create GA4 property
2. Add tracking ID to environment variables:
   ```bash
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### 7.2 Error Monitoring (Optional)
1. Set up Sentry account
2. Add DSN to environment variables:
   ```bash
   VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

## 🔄 Step 8: Ongoing Maintenance

### 8.1 Database Backups
Supabase automatically backs up your database. For additional safety:
1. Go to **Settings > Database**
2. Enable point-in-time recovery
3. Set up weekly database dumps (optional)

### 8.2 Content Management
- Use `/admin/import` for bulk business imports
- Use `/admin/system` for SEO sitemap generation
- Monitor import history and statistics

### 8.3 Performance Monitoring
- Check Netlify analytics for traffic patterns
- Monitor Supabase dashboard for database performance
- Review Core Web Vitals in Google Search Console

## 🆘 Troubleshooting

### Common Issues

**Build Fails on Netlify**
- Check environment variables are set correctly
- Verify Node.js version (should be 18+)
- Check build logs for specific errors

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies aren't blocking access
- Confirm migration ran successfully

**SEO Pages Not Loading**
- Check Netlify redirects are configured
- Verify SEO pages exist in database
- Test sitemap generation function

**Import Function Not Working**
- Verify service role key is set
- Check CSV format matches expected headers
- Review import job error details in admin panel

## 📞 Support

For issues with this deployment:
1. Check the troubleshooting section above
2. Review Netlify build logs
3. Check Supabase logs and metrics
4. Verify all environment variables are correctly set

---

**🎉 Congratulations!** Your Halal SG Connect platform should now be live and ready for users!