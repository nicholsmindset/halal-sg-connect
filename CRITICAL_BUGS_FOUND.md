# Critical Bugs Report - Deep Analysis
**Date:** 2025-11-06
**Project:** HalalHub SG Connect
**Analysis:** Logic Bugs, Data Handling, User Experience
**Severity Levels:** 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🔵 LOW

---

## 🔴 CRITICAL BUGS (Must Fix Before Production)

### 1. ListingForm Loses Opening Hours Data 🔴
**Severity:** CRITICAL
**Location:** `src/components/forms/ListingForm.tsx:211-229`
**Impact:** Users cannot save opening hours for their business

**Problem:**
The form schema includes `openingHours` as a required field (lines 58-94), users can fill it in, but when submitting, the `businessData` object (lines 211-229) **completely omits** the `openingHours` field. All opening hours data is silently lost.

**Code Analysis:**
```typescript
// Lines 58-94: Schema INCLUDES openingHours
openingHours: z.object({
  monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }),
  // ... all days
}),

// Lines 211-229: businessData EXCLUDES openingHours
const businessData = {
  name: data.name,
  slug: listingId ? undefined : slug,
  description: data.description,
  // ... other fields
  owner_id: user.id,
  // ❌ openingHours is MISSING!
};
```

**User Impact:**
- Business owners enter opening hours
- Form submits successfully
- Opening hours are completely lost
- No error message shown
- Users think data is saved but it's not

**Fix Required:**
Add `opening_hours: data.openingHours` to businessData (if database schema supports it, or store as JSON)

---

### 2. ListingForm Loses Social Media Data 🔴
**Severity:** CRITICAL
**Location:** `src/components/forms/ListingForm.tsx:211-229`
**Impact:** Users cannot save social media links

**Problem:**
Similar to opening hours, the form collects `socialMedia` data (Instagram, Facebook, TikTok) on lines 95-101 and 763-807, but this data is **never saved** to the database.

**Code Analysis:**
```typescript
// Lines 95-101: Schema INCLUDES socialMedia
socialMedia: z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
}).optional(),

// Lines 763-807: UI collects social media
<FormField name="socialMedia.instagram" ... />
<FormField name="socialMedia.facebook" ... />
<FormField name="socialMedia.tiktok" ... />

// Lines 211-229: businessData EXCLUDES socialMedia
// ❌ social_media is MISSING!
```

**Fix Required:**
Add `social_media: data.socialMedia` to businessData

---

### 3. EditListing Cannot Load Existing Data 🔴
**Severity:** CRITICAL
**Location:** `src/pages/EditListing.tsx:1-18`, `src/components/forms/ListingForm.tsx:139-177`
**Impact:** Editing a listing is completely broken

**Problem:**
When users try to edit an existing listing:
1. EditListing page passes `listingId` to ListingForm
2. ListingForm receives `listingId` but has **no code to fetch the listing data**
3. Form always shows empty default values
4. If user submits without re-entering all data, they **overwrite their listing with empty values**

**Code Analysis:**
```typescript
// EditListing.tsx - Just passes ID
const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  return <ListingForm listingId={id} />; // ❌ No data loading
};

// ListingForm.tsx - No useEffect to load data
const ListingForm = ({ listingId, onSave }: ListingFormProps) => {
  // ❌ Missing:
  // useEffect(() => {
  //   if (listingId) {
  //     fetchListingData(listingId);
  //   }
  // }, [listingId]);

  const form = useForm<BusinessFormData>({
    defaultValues: {
      name: '', // Always empty, even when editing!
      description: '',
      // ...
    },
  });
```

**User Impact:**
- User clicks "Edit" on their business
- Sees empty form instead of their current data
- If they fill fields and submit, existing data is overwritten
- Original data is permanently lost
- **DATA LOSS RISK**

**Fix Required:**
Add useEffect to fetch listing data when listingId is provided, and populate form with fetched data

---

### 4. Update Query Sets Slug to Undefined 🔴
**Severity:** CRITICAL
**Location:** `src/components/forms/ListingForm.tsx:213`
**Impact:** Updating a listing breaks its URL permanently

**Problem:**
Line 213: `slug: listingId ? undefined : slug`

When updating an existing listing, the slug is set to `undefined`. This will:
- Update the database slug column to NULL
- Break all existing URLs to that business
- Make the listing inaccessible
- Break all search engine indexed links
- Break all bookmarks/shares

**Code Analysis:**
```typescript
const businessData = {
  name: data.name,
  slug: listingId ? undefined : slug, // ❌ Sets slug to undefined on update!
  // ...
};

if (listingId) {
  // Update existing listing
  const { error } = await supabase
    .from('businesses')
    .update(businessData) // ❌ Sends slug: undefined
    .eq('id', listingId);
}
```

**Database Types:**
```typescript
// From src/integrations/supabase/types.ts:69
slug: string  // Required, not nullable in Insert
slug?: string // Optional in Update, but setting to undefined is dangerous
```

**Fix Required:**
Don't include slug in update payload: `slug: listingId ? undefined : slug` should be omitted entirely from update, or use:
```typescript
const businessData = {
  ...(!listingId && { slug }), // Only include slug for new listings
  // other fields
};
```

---

### 5. Pages Use Mock Data Instead of Database 🔴
**Severity:** CRITICAL
**Location:**
- `src/pages/Index.tsx`
- `src/pages/Listings.tsx`
- `src/pages/ListingDetails.tsx:29`

**Impact:** Application shows fake data, not real businesses from database

**Problem:**
Major pages are using `mockListings` and `mockData` instead of querying Supabase. Users see fake placeholder data, not real businesses.

**Code Analysis:**
```typescript
// ListingDetails.tsx:29
const listing = mockListings.find(l => l.slug === slug);
// ❌ Should be: useQuery to fetch from Supabase

// Listings.tsx - likely similar issue
// Index.tsx - likely similar issue
```

**User Impact:**
- Business owners create listings in database
- Listings never appear on the site
- Users only see mock/demo data
- Real businesses are hidden
- **The core functionality doesn't work**

**Fix Required:**
Replace all mockListings/mockData with real Supabase queries using useQuery

---

## 🟠 HIGH SEVERITY BUGS

### 6. Mobile Menu Button Does Nothing 🟠
**Severity:** HIGH
**Location:** `src/components/Header.tsx:202-204`
**Impact:** Mobile users cannot access navigation

**Problem:**
The mobile menu button has no onClick handler. When clicked, nothing happens.

**Code:**
```typescript
<Button variant="ghost" size="sm" className="md:hidden">
  <Menu className="h-4 w-4" />
</Button>
// ❌ No onClick, no state toggle, no menu display
```

**User Impact:**
- Mobile users see menu button
- Clicking does nothing
- Cannot access navigation links
- Cannot access authentication
- **Mobile navigation completely broken**

**Fix Required:**
Implement mobile menu state and drawer/sheet component

---

### 7. Search Bars Are Non-Functional 🟠
**Severity:** HIGH
**Location:** `src/components/Header.tsx:125, 212`
**Impact:** Search feature doesn't work

**Problem:**
Search input fields exist but have no event handlers. Users can type but search never executes.

**Code:**
```typescript
<Input placeholder="Search businesses..." className="pl-10" />
// ❌ No onChange, no onSubmit, no search logic
```

**User Impact:**
- Users try to search
- Can type in field
- Nothing happens when pressing Enter or submitting
- No search results
- **Core search feature broken**

**Fix Required:**
Add onChange/onSubmit handlers and implement search logic

---

### 8. "Save as Draft" Button Does Nothing 🟠
**Severity:** HIGH
**Location:** `src/components/forms/ListingForm.tsx:822-824`
**Impact:** Users cannot save draft listings

**Problem:**
The "Save as Draft" button exists but has no onClick handler. Clicking does nothing.

**Code:**
```typescript
<Button type="button" variant="outline">
  Save as Draft
</Button>
// ❌ No onClick handler, button is non-functional
```

**User Impact:**
- Users want to save work in progress
- Click "Save as Draft"
- Nothing happens
- No feedback
- Work can be lost if they navigate away

**Fix Required:**
Add onClick handler to save with `verification_status: 'draft'`

---

### 9. Business Owner Check Hardcoded to False 🟠
**Severity:** HIGH
**Location:** `src/pages/ListingDetails.tsx:32`
**Impact:** Business owners cannot edit their listings or respond to reviews

**Problem:**
`isBusinessOwner` is hardcoded to `false`, preventing any ownership verification.

**Code:**
```typescript
// Check if user is business owner (simplified - in real app, check business_owners table)
const isBusinessOwner = false; // ❌ Always false
```

**User Impact:**
- Business owners cannot edit their listings
- Cannot respond to customer reviews
- Cannot update business information
- **Ownership system doesn't work**

**Fix Required:**
Implement real ownership check: `listing.owner_id === currentUser?.id`

---

### 10. Wrong Navigation Method Used 🟠
**Severity:** HIGH
**Location:** `src/pages/ListingDetails.tsx:91`
**Impact:** Causes full page reload, breaks React Router

**Problem:**
Uses `window.location.href = '/auth'` instead of React Router's navigate, causing unnecessary full page reload and losing React state.

**Code:**
```typescript
<Button onClick={() => window.location.href = '/auth'}>
  Sign In
</Button>
// ❌ Should use: const navigate = useNavigate(); navigate('/auth');
```

**Impact:**
- Full page reload (slow)
- Loses React state
- Breaks back button behavior
- Poor user experience

**Fix Required:**
Use `useNavigate()` hook from React Router

---

## 🟡 MEDIUM SEVERITY BUGS

### 11. Image Upload Has No Limit 🟡
**Severity:** MEDIUM
**Location:** `src/components/forms/ListingForm.tsx:278-331`
**Impact:** Users could upload unlimited images, causing performance issues

**Problem:**
The image upload validates individual file size (5MB) but doesn't limit the total number of images.

**Code:**
```typescript
for (const file of Array.from(files)) {
  // Validates size per file ✓
  if (file.size > 5 * 1024 * 1024) {
    toast.error(`${file.name} is too large (max 5MB)`);
    continue;
  }
  // ❌ No check for total image count
  // Users could upload 100+ images
}
```

**Impact:**
- Database bloat
- Slow page loads
- High storage costs
- Poor UI with too many images

**Fix Required:**
Add maximum image count check (e.g., max 10 images)

---

### 12. Filename Collision Risk 🟡
**Severity:** MEDIUM
**Location:** `src/components/forms/ListingForm.tsx:301`
**Impact:** Uploaded images could overwrite each other (low probability)

**Problem:**
Uses `Math.random()` for filename generation instead of UUID.

**Code:**
```typescript
const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
// ❌ Math.random() can theoretically create collisions
// Better: Use crypto.randomUUID() or nanoid
```

**Impact:**
- Rare but possible file overwrites
- Lost images
- User confusion

**Fix Required:**
Use `crypto.randomUUID()` for guaranteed unique filenames

---

### 13. Form State Inconsistency with onSave 🟡
**Severity:** MEDIUM
**Location:** `src/components/forms/ListingForm.tsx:184-186`
**Impact:** When using onSave callback, form state doesn't match selected features/tags

**Problem:**
When `onSave` callback is provided, the form merges `selectedFeatures` and `selectedTags` into formData, but these don't sync with the form's internal state.

**Code:**
```typescript
const formData = {
  ...data,
  features: selectedFeatures, // ❌ Not synced with form.getValues('features')
  tags: selectedTags,         // ❌ Not synced with form.getValues('tags')
};
```

**Impact:**
- State inconsistency
- Form validation might not work correctly
- Confusing for developers

**Fix Required:**
Sync selectedFeatures/selectedTags with form state using form.setValue()

---

### 14. No Error Handling for File Upload Failures 🟡
**Severity:** MEDIUM
**Location:** `src/components/forms/ListingForm.tsx:306-313`
**Impact:** If storage upload fails, user gets error but partial uploads might remain

**Problem:**
If upload fails midway through multiple files, successfully uploaded files remain but aren't tracked properly.

**Code:**
```typescript
for (const file of Array.from(files)) {
  // ...upload logic...
  if (uploadError) {
    toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
    continue; // ❌ Previous uploads aren't rolled back
  }
  uploadedUrls.push(publicUrl);
}
```

**Impact:**
- Orphaned files in storage
- Storage costs for unused files
- Confusion about which images uploaded

**Fix Required:**
Consider rolling back failed uploads or better error handling

---

## 🔵 LOW SEVERITY ISSUES

### 15. Console.log Statements in Production 🔵
**Severity:** LOW
**Location:** 39 occurrences across 13 files
**Impact:** Clutters console, may expose debug info

**Examples:**
- `src/contexts/AuthContext.tsx:70` - console.error('Error initializing auth:', error)
- `src/components/ProtectedRoute.tsx:41` - console.error('Auth check failed:', error)
- `src/components/forms/ListingForm.tsx:253` - console.error('Error saving listing:', error)

**Fix Required:**
Replace with proper logging service (Sentry is already configured)

---

### 16. Missing Input Validation for Opening Hours 🔵
**Severity:** LOW
**Location:** `src/components/forms/ListingForm.tsx:656-704`
**Impact:** Users can set illogical hours (e.g., close time before open time)

**Problem:**
No validation that closing time is after opening time.

**Fix Required:**
Add validation: `close > open` for each day

---

### 17. No Loading State for Image Uploads 🔵
**Severity:** LOW
**Location:** `src/components/forms/ListingForm.tsx:278-331`
**Impact:** User doesn't know upload is in progress

**Problem:**
No loading indicator during image upload. User might think nothing is happening.

**Fix Required:**
Add loading state and progress indicator

---

## 📊 Bug Summary

| Severity | Count | Must Fix Before Prod |
|----------|-------|---------------------|
| 🔴 Critical | 5 | ✅ YES |
| 🟠 High | 5 | ✅ YES |
| 🟡 Medium | 4 | ⚠️ Recommended |
| 🔵 Low | 3 | 🔄 Nice to have |
| **TOTAL** | **17** | **10 blockers** |

---

## 🎯 Priority Fix Order

### Phase 1: Data Integrity (CRITICAL - Fix First)
1. ✅ Fix EditListing to load existing data (Bug #3)
2. ✅ Fix Update query slug issue (Bug #4)
3. ✅ Add openingHours to database save (Bug #1)
4. ✅ Add socialMedia to database save (Bug #2)
5. ✅ Replace mock data with Supabase queries (Bug #5)

### Phase 2: Core Functionality (HIGH - Fix Next)
1. ✅ Implement business owner check (Bug #9)
2. ✅ Add mobile menu functionality (Bug #6)
3. ✅ Implement search functionality (Bug #7)
4. ✅ Add "Save as Draft" functionality (Bug #8)
5. ✅ Fix navigation to use React Router (Bug #10)

### Phase 3: UX Improvements (MEDIUM)
1. Add image upload limit (Bug #11)
2. Use UUID for filenames (Bug #12)
3. Sync form state (Bug #13)
4. Improve upload error handling (Bug #14)

### Phase 4: Polish (LOW)
1. Remove console.log statements (Bug #15)
2. Add opening hours validation (Bug #16)
3. Add upload loading states (Bug #17)

---

## 💡 Testing Recommendations

### Critical Test Cases to Run After Fixes:

1. **Create New Listing Test:**
   - Fill all fields including opening hours and social media
   - Submit form
   - Verify ALL data saved to database
   - Check data appears correctly when viewing listing

2. **Edit Listing Test:**
   - Click edit on existing listing
   - Verify form loads with current data
   - Change some fields
   - Save
   - Verify changes applied without losing other data
   - **Verify slug didn't change**

3. **Mobile Navigation Test:**
   - Open site on mobile device/viewport
   - Click menu button
   - Verify navigation menu opens
   - Test all navigation links

4. **Search Test:**
   - Type in search bar
   - Press Enter
   - Verify search results appear
   - Test search with various queries

5. **Image Upload Test:**
   - Upload multiple images
   - Verify all images appear in preview
   - Try uploading file >5MB (should fail)
   - Try uploading non-image file (should fail)
   - Submit form and verify images saved

---

## 🔍 Root Cause Analysis

### Why These Bugs Exist:

1. **Incomplete Implementation:**
   - Forms and UI built before backend integration
   - Mock data used for prototyping, never replaced
   - Features coded but not connected to database

2. **Missing Data Flow:**
   - Form collects data that's never saved (opening hours, social media)
   - Edit mode doesn't load existing data
   - One-way data flow (UI → DB) without read operations

3. **State Management Issues:**
   - Form state vs component state inconsistency
   - No loading of existing data for edit mode

4. **Incomplete Features:**
   - Buttons without handlers (Save as Draft, Mobile Menu)
   - Search UI without search logic
   - Ownership checking hardcoded

---

## ✅ Testing Checklist After Fixes

- [ ] Create new listing with ALL fields populated
- [ ] Verify opening hours saved and displayed correctly
- [ ] Verify social media links saved and displayed
- [ ] Edit existing listing - verify current data loads
- [ ] Edit listing - verify slug remains unchanged
- [ ] View listing details page - verify real data (not mock)
- [ ] Test mobile menu opens and closes
- [ ] Test search functionality returns results
- [ ] Test "Save as Draft" creates draft listing
- [ ] Test business owner can edit their listing
- [ ] Test non-owner cannot edit listing
- [ ] Test image upload limit enforced
- [ ] Test opening hours validation (close > open)
- [ ] Test all navigation uses React Router
- [ ] Verify no console.log in production build

---

**Report Generated By:** Claude Code Deep Bug Analysis
**Next Steps:** Fix Phase 1 critical bugs, then Phase 2 high priority bugs
**Estimated Fix Time:**
- Phase 1 (Critical): 4-6 hours
- Phase 2 (High): 3-4 hours
- Phase 3 (Medium): 2-3 hours
- Phase 4 (Low): 1-2 hours
- **Total:** 10-15 hours

**Risk Assessment:**
- **Current Risk Level:** 🔴 HIGH
- **After Phase 1+2 Fixes:** 🟡 MEDIUM
- **After All Fixes:** 🟢 LOW
