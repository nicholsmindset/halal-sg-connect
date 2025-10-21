# 📥 CSV Import & Programmatic SEO Guide

**Complete guide for importing Google My Business listings and generating SEO pillar pages**

---

## 🎯 Overview

This system allows you to:
1. **Import CSV files** from Google My Business scraping
2. **Geocode addresses** automatically using Singapore OneMap API
3. **Validate and deduplicate** business listings
4. **Generate 496+ SEO pillar pages** covering all Singapore locations and categories
5. **Track import progress** with job monitoring

---

## 📋 Table of Contents

1. [CSV Import Process](#csv-import-process)
2. [Google My Business CSV Format](#google-my-business-csv-format)
3. [Programmatic SEO Page Generation](#programmatic-seo-page-generation)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)

---

## 📥 CSV Import Process

### Step 1: Prepare Your CSV File

Use the template: `scripts/google-my-business-import-template.csv`

**Required Columns:**
- Business Name
- Address
- Postal Code (Singapore 6-digit)
- Phone Number
- Category
- Halal Certified (TRUE/FALSE)

**Optional Columns:**
- Website
- Google Place ID
- Rating (1.0-5.0)
- Review Count
- Price Level ($, $$, $$$, $$$$)
- Opening Hours
- Latitude/Longitude
- Business Description
- Certification Body (MUIS, JAKIM, etc.)
- Cuisine Types (comma-separated)
- Features (comma-separated)
- Tags (comma-separated)

### Step 2: Upload via Admin Dashboard

**Web Interface:**

1. Navigate to `/admin/import`
2. Click "Upload CSV File"
3. Select your CSV file
4. Map CSV columns to database fields (auto-mapped for common columns)
5. Configure import options:
   - ✅ Skip duplicates (recommended)
   - ✅ Auto-geocode addresses (recommended)
   - ⬜ Validate only (test mode - no actual import)
   - Batch size: 100 (default)
6. Click "Start Import"
7. Monitor progress in real-time

**Import Progress Shows:**
- Total records
- Successful imports
- Failed imports
- Current record processing
- Estimated time remaining

### Step 3: Review Import Results

After import completes:

1. **View Statistics**:
   - Total processed
   - Success rate
   - Failed records with error messages

2. **Verify Businesses**:
   - Navigate to `/admin/businesses`
   - Filter by `verification_status = needs_review`
   - Manually verify halal certifications
   - Update any incorrect data

3. **Handle Duplicates**:
   - System auto-detects potential duplicates
   - Review in `/admin/businesses` duplicates tab
   - Merge or mark as unique

---

## 🗂️ Google My Business CSV Format

### Column Mapping

The system automatically maps these common column names:

| Your CSV Column | Maps To | Notes |
|-----------------|---------|-------|
| Business Name, Name, Title | `name` | Required |
| Address, Full Address, Location | `address` | Required |
| Postal Code, ZIP, Post Code | `postal_code` | Singapore 6-digit |
| Phone, Phone Number, Contact | `phone` | +65 format |
| Website, URL, Site | `website` | Full URL |
| Place ID, Google ID | `google_place_id` | ChIJ... format |
| Category, Type, Business Type | `category` | restaurant, cafe, etc. |
| Rating, Star Rating | `rating` | 1.0-5.0 |
| Reviews, Review Count | `review_count` | Integer |
| Price, Price Level | `price_level` | $, $$, $$$, $$$$ |
| Hours, Opening Hours | `business_hours` | Mon-Sun 10:00-22:00 |
| Latitude, Lat | `latitude` | Decimal degrees |
| Longitude, Lng, Long | `longitude` | Decimal degrees |
| Description, About | `description` | Text |
| Halal, Halal Certified | `halal_certified` | TRUE/FALSE |
| Certification, Cert Body | `certification_body` | MUIS, JAKIM |
| Cuisine, Cuisine Types | `cuisine_types` | Comma-separated |
| Features, Amenities | `features` | Comma-separated |
| Tags, Keywords | `tags` | Comma-separated |

### Example CSV Row

```csv
"Ayam Penyet President","123 Orchard Road, Singapore","238858","+6591234567","https://ayampenyet.sg","ChIJxxxxxxxxxxxxx","Restaurant","4.5","250","$$","Mon-Sun 10:00-22:00","1.3048","103.8318","Authentic Indonesian halal cuisine","TRUE","MUIS","Indonesian,Malay","dine-in,takeaway,halal-certified","indonesian,halal,ayam penyet"
```

### Data Validation Rules

**Automatic Validations:**
- ✅ Business name: Required, max 200 chars
- ✅ Address: Required, max 500 chars
- ✅ Postal code: 6 digits, Singapore format
- ✅ Phone: Valid Singapore format (+65...)
- ✅ Rating: 1.0-5.0 range
- ✅ Email: Valid email format
- ✅ Website: Valid URL format
- ✅ Coordinates: Valid lat/lng for Singapore (1.1-1.5N, 103.6-104.0E)

**Warnings (non-blocking):**
- ⚠️ Missing description
- ⚠️ Missing website
- ⚠️ Missing opening hours
- ⚠️ No halal certification specified
- ⚠️ No category assigned

---

## 🚀 Programmatic SEO Page Generation

### Overview

The system generates **496 SEO pillar pages** covering:
- All 55 Singapore planning areas (districts)
- All 28 property districts (D01-D28)
- All 20 food business categories
- Top combinations (100 pages)
- Feature-based pages (9 pages)
- Price range pages (4 pages)

**Total Coverage**: 496 high-value SEO landing pages

### Generation Commands

```bash
# Generate all 496 pillar pages (LIVE - creates in database)
npm run generate:all-pillars

# Dry run (preview what would be created)
npm run generate:all-pillars:dry-run

# Generate only specific tiers (using the old script)
npm run generate:seo:districts     # Planning areas only
npm run generate:seo:high          # High-priority pages only
```

### Page Tiers Breakdown

#### Tier 1: Planning Area Pages (55 pages)
- **Pattern**: `/district/{area}`
- **Example**: `/district/tampines`
- **SEO Title**: "Halal Restaurants in Tampines | Singapore"
- **Coverage**: All 55 Singapore planning areas

#### Tier 2: Property District Pages (28 pages)
- **Pattern**: `/property-zone/{code}`
- **Example**: `/property-zone/d01`
- **SEO Title**: "D01 Singapore - Halal Restaurants & Cafes"
- **Coverage**: All 28 property districts (D01-D28)

#### Tier 3: Category Pages (20 pages)
- **Pattern**: `/category/{category}`
- **Example**: `/category/restaurants`
- **SEO Title**: "Best Halal Restaurants in Singapore"
- **Coverage**: All major food business categories

#### Tier 4: Planning Area + Category (100 pages)
- **Pattern**: `/district/{area}/{category}`
- **Example**: `/district/tampines/restaurants`
- **SEO Title**: "Halal Restaurants in Tampines | Singapore"
- **Coverage**: Top 10 areas × Top 10 categories

#### Tier 5: Property District + Category (280 pages)
- **Pattern**: `/property-zone/{code}/{category}`
- **Example**: `/property-zone/d01/restaurants`
- **SEO Title**: "D01 - Halal Restaurants Singapore"
- **Coverage**: All 28 districts × Top 10 categories

#### Tier 6: Feature Pages (9 pages)
- **Pattern**: `/features/{feature}`
- **Example**: `/features/halal-certified`
- **SEO Title**: "Halal Certified Restaurants in Singapore"
- **Coverage**: Key features (prayer facilities, wheelchair access, etc.)

#### Tier 7: Price Range Pages (4 pages)
- **Pattern**: `/price/{range}`
- **Example**: `/price/budget`
- **SEO Title**: "Budget-Friendly Halal Restaurants in Singapore"
- **Coverage**: Budget, Mid-range, Premium, Fine Dining

### Auto-Generated Content

Each page automatically includes:
- **SEO Metadata**: Title, description, keywords
- **Business Count**: Real-time count from database
- **Filters**: Applied automatically to show relevant businesses
- **Schema Markup**: JSON-LD for search engines
- **Publishing Status**: Only published if businesses exist

### Regeneration

Run the generation script regularly to:
- Update business counts
- Add new pages for new locations/categories
- Refresh content based on latest data

**Recommended Schedule**:
- After bulk CSV imports
- Weekly automated regeneration
- Monthly full regeneration

---

## 🔌 API Endpoints

### 1. Bulk Import API

**Endpoint**: `POST /functions/v1/bulk-import`

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_SUPABASE_TOKEN",
  "Content-Type": "multipart/form-data"
}
```

**Body** (FormData):
```javascript
{
  file: File,  // CSV file
  mapping: JSON.stringify({
    "Business Name": "name",
    "Address": "address",
    // ... more mappings
  }),
  options: JSON.stringify({
    skipDuplicates: true,
    autoGeocode: true,
    validateOnly: false,
    batchSize: 100
  })
}
```

**Response**:
```json
{
  "jobId": "uuid-here",
  "totalRecords": 150,
  "successful": 145,
  "failed": 5,
  "errors": [
    "Row 12: Invalid postal code",
    "Row 45: Duplicate business name"
  ]
}
```

### 2. Import Progress API

**Endpoint**: `GET /api/import/progress/{jobId}`

**Response**:
```json
{
  "id": "uuid",
  "status": "processing",
  "totalRecords": 150,
  "processedRecords": 75,
  "successfulImports": 72,
  "failedImports": 3,
  "progressPercentage": 50,
  "currentRecord": 75,
  "errorLog": ["Error 1", "Error 2"]
}
```

### 3. Geocoding API (OneMap Singapore)

**Endpoint**: `GET https://developers.onemap.sg/commonapi/search`

**Parameters**:
- `searchVal`: Address or postal code
- `returnGeom`: Y (return coordinates)
- `getAddrDetails`: Y (return address details)

**Example**:
```
https://developers.onemap.sg/commonapi/search?searchVal=238858&returnGeom=Y&getAddrDetails=Y
```

**Response**:
```json
{
  "results": [{
    "LATITUDE": "1.30484",
    "LONGITUDE": "103.83188",
    "ADDRESS": "123 ORCHARD ROAD SINGAPORE 238858"
  }]
}
```

---

## 🛠️ Troubleshooting

### Common Import Errors

#### 1. "Invalid postal code"
- **Cause**: Non-Singapore postal code or wrong format
- **Solution**: Ensure 6-digit Singapore postal codes (e.g., 238858)

#### 2. "Geocoding failed"
- **Cause**: Address not found in OneMap database
- **Solution**:
  - Verify address format
  - Use postal code instead of full address for geocoding
  - Manually add coordinates if known

#### 3. "Duplicate business detected"
- **Cause**: Business with same name or Google Place ID already exists
- **Solution**:
  - Enable "Skip duplicates" option
  - Or manually merge duplicates in admin panel

#### 4. "Validation failed: halal_certified"
- **Cause**: Invalid value in halal certified column
- **Solution**: Use TRUE/FALSE, YES/NO, 1/0, or MUIS/JAKIM

#### 5. "Import job timeout"
- **Cause**: Too many records in single batch
- **Solution**:
  - Reduce batch size (try 50 instead of 100)
  - Split CSV into smaller files
  - Import during off-peak hours

### Performance Tips

**For Large Imports (1000+ records)**:
1. Split into multiple CSV files (500 records each)
2. Reduce batch size to 50
3. Disable auto-geocoding initially (geocode later)
4. Run imports during off-peak hours
5. Use validation mode first to catch errors

**For Best Geocoding Results**:
1. Always include postal codes
2. Use Singapore standard address format
3. Verify addresses on OneMap first: https://www.onemap.gov.sg/
4. For missing addresses, use manual coordinate entry

### Checking Import Status

```sql
-- Check recent imports
SELECT
  filename,
  status,
  total_records,
  successful_imports,
  failed_imports,
  created_at
FROM import_jobs
ORDER BY created_at DESC
LIMIT 10;

-- Check businesses from specific import
SELECT
  name,
  address,
  verification_status,
  halal_certified
FROM businesses
WHERE import_job_id = 'YOUR_JOB_ID'
LIMIT 20;

-- Check duplicate detections
SELECT
  b1.name as business_1,
  b2.name as business_2,
  similarity_score,
  match_type
FROM business_duplicates bd
JOIN businesses b1 ON bd.business_id_1 = b1.id
JOIN businesses b2 ON bd.business_id_2 = b2.id
WHERE status = 'pending'
ORDER BY similarity_score DESC;
```

---

## 📊 Expected Results

### After CSV Import:
- ✅ Businesses added to database
- ✅ Import job tracked with statistics
- ✅ Duplicates detected and flagged
- ✅ Addresses geocoded automatically
- ✅ Verification queue populated

### After Pillar Page Generation:
- ✅ 496 SEO pages created/updated
- ✅ Business counts updated per page
- ✅ Pages published only if businesses exist
- ✅ Filters applied correctly
- ✅ URLs accessible immediately

### SEO Impact:
- 🎯 **Target**: 496 indexed pages
- 🎯 **Keywords**: 1,000+ long-tail keywords covered
- 🎯 **Traffic**: Organic traffic from Singapore searches
- 🎯 **Coverage**: 100% of Singapore locations + all food categories

---

## 🚀 Quick Start Checklist

- [ ] 1. Prepare CSV file using template
- [ ] 2. Verify column headers match expected format
- [ ] 3. Upload CSV via `/admin/import`
- [ ] 4. Map columns (auto-mapped for common names)
- [ ] 5. Enable "Skip duplicates" and "Auto-geocode"
- [ ] 6. Start import and monitor progress
- [ ] 7. Review imported businesses in admin panel
- [ ] 8. Verify halal certifications
- [ ] 9. Run `npm run generate:all-pillars`
- [ ] 10. Verify pillar pages created successfully
- [ ] 11. Check a few pages to ensure data displays correctly
- [ ] 12. Submit sitemap to Google Search Console

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section above
2. Review Supabase logs: Dashboard → Logs → Edge Functions
3. Check import job error logs in database
4. Contact development team with:
   - Import job ID
   - Error messages
   - CSV file sample (first 10 rows)

---

**Last Updated**: 2025-10-21
**Version**: 1.0.0
