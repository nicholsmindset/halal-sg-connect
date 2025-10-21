# 🚀 Deployment Guide - Halal SG Connect

This guide covers deploying Halal SG Connect to production using Netlify and Supabase.

## 📋 Prerequisites

- [ ] GitHub repository set up
- [ ] Netlify account created
- [ ] Supabase project created
- [ ] Domain name (optional)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details:
   - **Name**: halal-sg-connect
   - **Database Password**: (Save this securely!)
   - **Region**: Singapore (Southeast Asia)

### 2. Run Database Migrations

1. Navigate to SQL Editor in Supabase Dashboard
2. Open `supabase/migrations/000_production_setup.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"
6. Repeat for `supabase/migrations/001_bulk_import_schema.sql`

### 3. Set up Storage Bucket

1. Go to Storage → Buckets
2. Create new bucket: `business-assets`
3. Set as **Public bucket**
4. Configure policies:
   - Allow public read access
   - Allow authenticated insert/update/delete

### 4. Get API Keys

Navigate to Settings → API:
- **Project URL**: Copy this (format: `https://xxx.supabase.co`)
- **anon/public key**: Copy this (starts with `eyJ...`)
- **service_role key**: Copy this (starts with `eyJ...`) - **Keep secret!**

## 🌐 Netlify Deployment

### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20`

### 2. Configure Environment Variables

Go to Site settings → Environment variables and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side Supabase (for Netlify Functions)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
VITE_APP_NAME=Halal SG Connect
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Production Settings
NODE_ENV=production
VITE_APP_URL=https://your-domain.netlify.app

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_PREMIUM_FEATURES=true

# Optional: Error Monitoring (Sentry)
VITE_SENTRY_DSN=your-sentry-dsn-here

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 3. Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be live at: `https://[random-name].netlify.app`

### 4. Custom Domain (Optional)

1. Go to Domain settings
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## 🔒 Security Checklist

- [ ] Environment variables configured in Netlify
- [ ] Service role key kept secret (never in code)
- [ ] HTTPS enabled (automatic with Netlify)
- [ ] RLS policies enabled in Supabase
- [ ] CORS configured properly
- [ ] Rate limiting configured
- [ ] Security headers configured (already in `netlify.toml`)

## 📊 Error Monitoring (Optional - Sentry)

### 1. Create Sentry Project

1. Go to [Sentry.io](https://sentry.io/)
2. Create new project → React
3. Copy your DSN

### 2. Add to Netlify

Add environment variable:
```env
VITE_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project-id]
```

## ✅ Post-Deployment Checklist

### Immediate Actions
- [ ] Test user registration flow
- [ ] Test business listing creation
- [ ] Test image uploads
- [ ] Verify search functionality
- [ ] Check mobile responsiveness
- [ ] Test all navigation links

### Database Setup
- [ ] Import initial business data (if any)
- [ ] Create admin user account
- [ ] Set up categories and districts
- [ ] Configure email templates

### Performance
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G connection
- [ ] Verify bundle sizes

### Monitoring
- [ ] Sentry error tracking working
- [ ] Analytics configured
- [ ] Set up uptime monitoring
- [ ] Configure backup schedule

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Issue**: Variables undefined in production
**Solution**:
- Verify variables start with `VITE_` for client-side
- Redeploy site after adding variables
- Check build logs for errors

### Database Connection Issues

**Issue**: "Failed to connect to database"
**Solution**:
- Verify `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is valid
- Ensure RLS policies allow access

### Image Upload Fails

**Issue**: Images not uploading to Supabase Storage
**Solution**:
- Verify `business-assets` bucket exists
- Check bucket is set to public
- Verify storage policies allow uploads

## 📞 Support

If you encounter issues:
1. Check [Netlify docs](https://docs.netlify.com/)
2. Check [Supabase docs](https://supabase.com/docs)
3. Review build logs in Netlify
4. Check browser console for errors

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for CI/CD:
- Automatic builds on push to main
- Run tests before deployment
- Automatic deploy to Netlify

## 📈 Monitoring & Analytics

### Key Metrics to Track
- User registrations
- Business listings created
- Search queries
- Page views
- Error rates
- API response times

### Tools
- **Sentry**: Error tracking
- **Google Analytics**: User analytics
- **Netlify Analytics**: Traffic & performance
- **Supabase Dashboard**: Database metrics

---

**Last Updated**: 2025-01-21
**Version**: 1.0.0
