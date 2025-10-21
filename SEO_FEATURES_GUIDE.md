# 🚀 SEO Programmatic Pages - Complete Guide

This guide covers all the SEO features implemented for Halal SG Connect, including programmatic page generation, internal linking strategies, and curated "Best Of" lists.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Geographic Coverage](#geographic-coverage)
3. [Batch Page Generation](#batch-page-generation)
4. [Internal Linking Strategy](#internal-linking-strategy)
5. [Best Of Curated Lists](#best-of-curated-lists)
6. [Content Sections](#content-sections)
7. [URL Structure](#url-structure)
8. [Sitemap Generation](#sitemap-generation)
9. [Usage Examples](#usage-examples)

---

## Overview

Your SEO setup now includes:

- ✅ **55 Planning Areas** (districts/neighborhoods)
- ✅ **28 Property Districts** (D01-D28)
- ✅ **15+ Categories** (restaurants, cafes, etc.)
- ✅ **Multi-level combinations** (district + category)
- ✅ **8 Best Of curated lists**
- ✅ **Enhanced internal linking** (nearby areas, popular combinations)
- ✅ **Muslim-specific content** (mosques, prayer facilities, transport)

**Total Potential Pages**: ~1,682 SEO-optimized pages
**Realistic Target**: 400-600 high-value pages

---

## Geographic Coverage

### 1. Planning Areas (55 Total)

**Central Region** (18 districts):
- Ang Mo Kio, Bishan, Bukit Merah, Bukit Timah, Geylang, Kallang, Marine Parade, Museum, Newton, Novena, Orchard, Outram, Queenstown, River Valley, Rochor, Singapore River, Tanglin, Toa Payoh

**East Region** (6 districts):
- Bedok, Changi, Changi Bay, Pasir Ris, Paya Lebar, Tampines

**North Region** (8 districts):
- Central Water Catchment, Lim Chu Kang, Mandai, Sembawang, Simpang, Sungei Kadut, Woodlands, Yishun

**West Region** (11 districts):
- Boon Lay, Bukit Batok, Bukit Panjang, Choa Chu Kang, Clementi, Jurong East, Jurong West, Pioneer, Tengah, Tuas, West Coast

**Northeast Region** (5 districts):
- Hougang, Punggol, Seletar, Sengkang, Serangoon

**Special Areas** (7):
- Downtown Core, Marina East, Marina South, North-Eastern Islands, Southern Islands, Straits View, Western Islands, Western Water Catchment

### 2. Property Districts (28 Total: D01-D28)

**Business/Commercial**:
- D01 (Marina Bay/Raffles Place), D02 (Chinatown), D06 (City Hall), D09 (Orchard)

**Cultural/Heritage**:
- D07 (Arab Street/Bugis), D08 (Little India)

**Premium Residential**:
- D09 (Orchard/River Valley), D10 (Tanglin/Bukit Timah), D11 (Newton/Novena)

**Family Residential**:
- D16 (Bedok), D18 (Tampines/Pasir Ris), D19 (Hougang/Punggol/Sengkang), D20 (Ang Mo Kio/Bishan)

**Industrial/Border**:
- D22 (Jurong/Boon Lay), D25 (Woodlands), D28 (Seletar)

---

## Batch Page Generation

### Installation

```bash
npm install
```

### Usage

```bash
# Generate all SEO pages
npm run generate:seo

# Generate only high-priority pages
npm run generate:seo:high

# Generate only district pages
npm run generate:seo:districts

# Generate high-priority combinations
npm run generate:seo:combinations
```

### What Gets Generated

| Command | Pages Generated | Estimated Count |
|---------|----------------|-----------------|
| `generate:seo` | All pages | ~1,682 |
| `generate:seo:high` | Top districts + categories | ~400 |
| `generate:seo:districts` | All planning areas | 55 |
| `generate:seo:combinations` | Top combinations | ~200 |

### Priority Levels

**CRITICAL** (Generate First):
- D01, D07, D08, D09, D18, D19, D20, D22, D25

**HIGH** (Generate Second):
- Tampines, Jurong East, Bedok, Orchard, Woodlands, Hougang, Punggol, Sengkang, Ang Mo Kio, Bishan

### Script Features

- ✅ Automatic business counting
- ✅ Skip existing pages
- ✅ Rate limiting (100ms delay)
- ✅ Error tracking
- ✅ Progress logging
- ✅ Statistics summary

---

## Internal Linking Strategy

### Nearby Districts

Each district page automatically links to **6 nearby districts** based on geographic proximity.

Example for **Tampines**:
- Pasir Ris
- Bedok
- Simei
- Changi

### Similar Property Zones

Property districts link to similar zones by type:

**Business Districts** (D01):
- D02 (Chinatown)
- D06 (City Hall)
- D09 (Orchard)

**Cultural Districts** (D07):
- D08 (Little India)
- D02 (Chinatown)
- D09 (Orchard)

### Popular Combinations

Each page shows **8 popular combinations**:

**Category Pages**:
- Top districts × this category
- Example: "Restaurants" → Tampines Restaurants, Orchard Restaurants, etc.

**District Pages**:
- This district × top categories
- Example: "Tampines" → Tampines Restaurants, Tampines Cafes, etc.

### Trending Searches

Every page includes **6 trending searches**:
1. Halal Certified Restaurants
2. Family Friendly Dining
3. Delivery Available
4. Budget Dining
5. Premium Restaurants
6. Prayer Facilities

---

## Best Of Curated Lists

### Available Lists

| List | URL | Count |
|------|-----|-------|
| Best Halal Restaurants 2024 | `/best/best-halal-restaurants-singapore` | 20 |
| Top Cafes in Orchard | `/best/top-halal-cafes-orchard` | 10 |
| Family-Friendly in Tampines | `/best/family-friendly-halal-dining-tampines` | 15 |
| Budget Halal Food | `/best/budget-halal-food-singapore` | 25 |
| Premium Fine Dining | `/best/premium-halal-dining-singapore` | 12 |
| Trending Restaurants | `/best/trending-halal-restaurants` | 20 |
| Best Delivery Options | `/best/best-halal-food-delivery` | 20 |
| Prayer Facilities | `/best/halal-restaurants-prayer-facilities` | 15 |

### Filters Applied

Each list has specific filters:

**Best Halal Restaurants**:
- Minimum Rating: 4.5+
- Sort: By rating (descending)
- MUIS Certified: Yes

**Budget Halal Food**:
- Price Range: Budget
- Minimum Rating: 4.0+
- Maximum: $15 per meal

**Premium Fine Dining**:
- Price Range: Premium
- Minimum Rating: 4.5+
- Is Premium: Yes
- Sort: By rating

### Adding New Lists

Edit `/src/pages/BestOfPage.tsx`:

```typescript
const BEST_OF_LISTS: Record<string, BestOfConfig> = {
  'your-new-list-slug': {
    slug: 'your-new-list-slug',
    title: 'Your List Title',
    description: 'Description for SEO',
    icon: Award, // Choose from lucide-react
    filters: {
      category: 'restaurants',
      minRating: 4.5
    },
    sortBy: 'rating',
    limit: 20
  }
};
```

---

## Content Sections

### Standard Sections (All Pages)

1. **Hero Section**
   - H1 title
   - Meta description
   - Statistics cards (total businesses, avg rating, halal certified, premium)

2. **Highlights**
   - Top-rated establishments
   - Premium listings count
   - Halal certification stats
   - Delivery options

3. **Popular Features**
   - Popular cuisines (top 5)
   - Top features (top 5)
   - Price distribution

4. **Business Listings**
   - Grid of business cards
   - Limit: 12 per page
   - "View All" button

5. **FAQs**
   - Dynamically generated Q&A
   - Customized by page type

6. **Related Searches**
   - 6 clickable search terms

### NEW Muslim-Specific Sections

#### Getting Here (Transport)
Shown on district and property zone pages:
- Public transport information
- Parking availability
- LTA Singapore app reference

#### Muslim-Friendly Services
Highlighted section with:
- **Nearby Mosques**
  - Mosque locations
  - Map integration prompt
  - Prayer times reference

- **Halal Certification**
  - MUIS-certified count
  - Prayer-friendly businesses
  - Verification badges

#### Nearby Areas
- 8 nearby district links
- Visual cards with icons
- One-click navigation

#### Trending Searches
- 6 popular search links
- Feature-based filters
- Price-based filters

---

## URL Structure

### Planning Areas
```
/district/{area-slug}
/district/{area-slug}/{category}

Examples:
/district/tampines
/district/tampines/restaurants
/district/orchard/cafes
```

### Property Districts
```
/property-zone/{code}
/property-zone/{code}/{category}

Examples:
/property-zone/d01
/property-zone/d07/restaurants
/property-zone/d18/cafes
```

### Categories
```
/category/{category-slug}

Examples:
/category/restaurants
/category/cafes
/category/fast-food
```

### Features
```
/features/{feature-slug}

Examples:
/features/halal-certified
/features/family-friendly
/features/prayer-facilities
```

### Price Ranges
```
/price/{range}

Examples:
/price/budget
/price/mid-range
/price/premium
```

### Best Of Lists
```
/best
/best/{list-slug}

Examples:
/best
/best/best-halal-restaurants-singapore
/best/budget-halal-food-singapore
```

---

## Sitemap Generation

### Included in Sitemap

1. ✅ Static pages (home, listings, dashboard, etc.)
2. ✅ All business listings
3. ✅ All SEO pages
4. ✅ All district pages
5. ✅ All property zone pages
6. ✅ All Best Of lists
7. ✅ Category pages
8. ✅ Feature pages

### Priority Levels

| Page Type | Priority | Change Freq |
|-----------|----------|-------------|
| Homepage | 1.0 | Daily |
| Best Of Lists | 0.9 | Daily |
| Category Pages | 0.8 | Weekly |
| District Pages | 0.7 | Weekly |
| Business Listings | 0.8 | Weekly |
| Feature Pages | 0.6 | Monthly |

### Regenerate Sitemap

The sitemap is generated automatically and includes all pages.

---

## Usage Examples

### Example 1: Generate All SEO Pages

```bash
# Install dependencies first
npm install

# Generate all high-priority pages (recommended for first run)
npm run generate:seo:high

# Check progress
# Stats will show: total, successful, skipped, failed
```

Expected output:
```
✅ Generated: district/tampines
✅ Generated: district/tampines/restaurants
✅ Generated: property-zone/d01
...
📊 STATISTICS
Total Attempted:  400
✅ Successful:     395
⚠️  Skipped:        5
❌ Failed:         0
```

### Example 2: Add Internal Links to Existing Code

```typescript
import { SEOPageGenerator } from '@/lib/seo-generator';

// Get internal links for a page
const links = SEOPageGenerator.generateInternalLinks(
  'district',
  { planning_area: 'tampines' }
);

console.log(links.nearbyAreas);
// [
//   { name: 'Pasir Ris', slug: 'district/pasir-ris' },
//   { name: 'Bedok', slug: 'district/bedok' },
//   ...
// ]

console.log(links.popularCombinations);
// [
//   { name: 'Tampines Restaurants', slug: 'district/tampines/restaurants' },
//   { name: 'Tampines Cafes', slug: 'district/tampines/cafes' },
//   ...
// ]
```

### Example 3: Create Custom Best Of List

1. Edit `/src/pages/BestOfPage.tsx`
2. Add new configuration:

```typescript
'best-halal-brunch-singapore': {
  slug: 'best-halal-brunch-singapore',
  title: 'Best Halal Brunch Spots in Singapore',
  description: 'Weekend brunch destinations with halal certification',
  icon: Sparkles,
  filters: {
    category: 'cafes',
    minRating: 4.0
  },
  sortBy: 'rating',
  limit: 15
}
```

3. Add to BestOfIndex.tsx lists array
4. Page automatically available at `/best/best-halal-brunch-singapore`

---

## Performance Tips

### 1. Batch Generation

Generate pages in batches to avoid overwhelming the database:

```bash
# Day 1: Districts only
npm run generate:seo:districts

# Day 2: High-priority combinations
npm run generate:seo:combinations

# Day 3: Remaining pages
npm run generate:seo
```

### 2. Database Indexes

Ensure these indexes exist:
```sql
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX idx_businesses_planning_area ON businesses(planning_area);
CREATE INDEX idx_businesses_property_district ON businesses(property_district_code);
CREATE INDEX idx_businesses_verification ON businesses(verification_status);
```

### 3. Caching

SEO pages are stored in database and only regenerated when needed.

---

## SEO Best Practices

### Title Tags
- Keep under 60 characters
- Include primary keyword
- Add location
- Example: "Best Halal Restaurants in Tampines | Singapore 2024"

### Meta Descriptions
- 150-160 characters
- Include call-to-action
- Mention MUIS certification
- Example: "Discover 50+ halal-certified restaurants in Tampines. Top-rated Muslim dining with reviews, ratings, and delivery options."

### Internal Linking
- 8-12 links per page
- Mix of nearby, similar, and trending
- Anchor text should be descriptive

### Content Freshness
- Update Best Of lists weekly
- Regenerate trending pages daily
- Refresh district pages monthly

---

## Troubleshooting

### Issue: Pages Not Generating

**Check**:
1. Database connection (Supabase credentials in `.env.local`)
2. Tables exist (`districts`, `property_districts`, `businesses`)
3. Data populated (run migrations first)

**Solution**:
```bash
# Check environment variables
cat .env.local

# Test database connection
npm run type-check
```

### Issue: Slow Generation

**Cause**: Too many pages being generated at once

**Solution**:
```bash
# Use priority filter
npm run generate:seo:high

# Or specify type
npm run generate:seo:districts
```

### Issue: Duplicate Pages

**Check**: The script skips existing pages automatically

**Solution**: Pages are updated only if content changes

---

## Next Steps

1. ✅ **Run Initial Generation**
   ```bash
   npm run generate:seo:high
   ```

2. ✅ **Test Best Of Pages**
   - Visit `/best`
   - Click through each list
   - Verify filters work

3. ✅ **Check Internal Links**
   - Visit any district page
   - Verify "Nearby Areas" section
   - Verify "Popular Combinations"

4. ✅ **Verify Sitemap**
   - Run sitemap generation
   - Check `/sitemap.xml`
   - Submit to Google Search Console

5. ✅ **Monitor Performance**
   - Track page load times
   - Monitor search rankings
   - Check Google Analytics

---

## Support

For issues or questions:
1. Check this guide
2. Review `DEPLOYMENT.md`
3. Check Supabase logs
4. Verify `.env.local` configuration

---

**Your SEO setup is now complete and production-ready!** 🎉

You have more SEO features than PropertyGuru with:
- ✅ Dual geographic taxonomy (planning + property)
- ✅ Muslim-specific content
- ✅ Enhanced internal linking
- ✅ Curated Best Of lists
- ✅ Automated generation
- ✅ Comprehensive coverage

Generate your pages and watch your organic traffic grow!
