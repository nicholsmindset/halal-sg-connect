# 🚀 Netlify Environment Variables Setup

Your Netlify site: **https://vocal-puffpuff-8d486c.netlify.app/**

## 📋 Environment Variables to Add in Netlify

Go to: **Site settings → Environment variables** and add these:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://lmbuaaenceaolrspljio.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYnVhYWVuY2Vhb2xyc3BsamlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzM2MDcsImV4cCI6MjA2OTU0OTYwN30.5KVHtDqxHkxNiBjoS8ZDvROnBlyd3hb0qSqbIEBFBiE

# Server-side Supabase (for Netlify Functions)
SUPABASE_URL=https://lmbuaaenceaolrspljio.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sbp_fc0673d3a040edb144e840dcb8105e87cef99b70

# App Configuration
VITE_APP_ENV=production
NODE_ENV=production
VITE_APP_URL=https://vocal-puffpuff-8d486c.netlify.app

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_PREMIUM_FEATURES=true
```

## ⚡ URGENT: Still Need From You

### 1. **Service Role Key**
- Go to Supabase dashboard: Settings → API
- Copy the **service_role** key (different from anon key)
- It should start with `eyJ...`

### 2. **Database Migration**
- Go to Supabase dashboard: SQL Editor
- Copy entire contents of `supabase/migrations/000_production_setup.sql`
- Paste and click "Run"

## 🎯 Next Steps After You Complete Above

1. Add environment variables to Netlify
2. Push code to trigger deployment
3. Test live site functionality
4. Import sample business data
5. Generate SEO pages

**Ready to proceed once you share the service role key!** 🚀