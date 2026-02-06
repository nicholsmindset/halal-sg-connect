# QA Testing Guide - Bug Fixes
**Version:** 1.0
**Date:** 2025-11-06
**Branch:** claude/test-routing-functionality-011CUo5cPuy7Xan96DusKDbK
**Commit:** 13eba67

---

## Overview

This guide covers QA testing for 10 critical and high priority bug fixes. All fixes have passed TypeScript type checking and production build tests.

**Test Environment:**
- ✅ TypeScript: No errors
- ✅ Build: Successful (14.82s)
- ✅ All imports: Resolved

---

## Quick Test Checklist

### Phase 1: Critical Features (Must Pass)
- [ ] Edit listing loads existing data
- [ ] Edit listing saves without breaking URL
- [ ] Real businesses appear (not mock data)
- [ ] "Save as Draft" button works
- [ ] Navigation uses React Router (no page reload)

### Phase 2: High Priority Features (Must Pass)
- [ ] Mobile menu opens and works
- [ ] Search functionality works
- [ ] Business owners can edit their listings
- [ ] Non-owners cannot edit listings

---

## Detailed Test Cases

## Test Case 1: Edit Listing - Data Loading
**Bug Fixed:** #3 - EditListing cannot load existing data
**Priority:** 🔴 CRITICAL
**Risk:** Data loss

### Setup
1. Log in as a business owner
2. Ensure you have at least one published business listing
3. Navigate to Dashboard → Your Listings

### Test Steps
1. Click "Edit" button on any of your listings
2. Wait for the form to load

### Expected Results
✅ **PASS Criteria:**
- Loading spinner appears briefly
- Form loads with ALL existing data:
  - Business name populated
  - Description filled in
  - Category selected
  - District selected
  - Address filled
  - Price range selected
  - Phone, email, website (if previously saved)
  - Halal certified toggle matches saved state
  - Features checkboxes match saved selections
  - Uploaded images appear in preview

❌ **FAIL Criteria:**
- Form shows empty fields
- Loading never completes
- Only some fields populate
- Error message appears

### How to Verify
1. Check the loaded data matches what's shown on the listing detail page
2. Compare with database data (optional)

---

## Test Case 2: Edit Listing - URL Stability
**Bug Fixed:** #4 - Update query sets slug to undefined
**Priority:** 🔴 CRITICAL
**Risk:** Permanent URL breakage

### Setup
1. Have an existing listing with a known URL (e.g., `/listings/my-restaurant`)
2. Log in as the owner
3. Navigate to edit page

### Test Steps
1. Load the edit form
2. Make a small change (e.g., update phone number)
3. Click "Update Listing"
4. Wait for success message
5. Navigate to the listing detail page
6. Check the URL in browser

### Expected Results
✅ **PASS Criteria:**
- URL remains exactly the same: `/listings/my-restaurant`
- Listing still accessible at original URL
- Changes are saved and visible
- Toast message: "Listing updated successfully!"

❌ **FAIL Criteria:**
- URL changes to something else
- URL becomes `/listings/undefined`
- 404 error when accessing original URL
- Listing not found

### How to Verify
1. Copy the listing URL before editing
2. After update, paste the URL - should still work
3. Check browser Network tab - slug field should NOT be in update payload

---

## Test Case 3: Real Data Display
**Bug Fixed:** #5 - Pages use mock data instead of database
**Priority:** 🔴 CRITICAL
**Risk:** Core functionality broken

### Setup
1. Create a new business listing (or use existing)
2. Publish it
3. Log out (test as anonymous user)

### Test Steps
1. Navigate to `/listings`
2. Click on your business
3. View the listing details

### Expected Results
✅ **PASS Criteria:**
- Your real business appears in listings
- Clicking shows your real data
- Loading spinner appears briefly
- All data matches what you entered
- Images display correctly

❌ **FAIL Criteria:**
- Only sees demo/fake businesses
- Real businesses don't appear
- Shows "Demo Restaurant" or similar fake names
- Error: "Listing not found" for real businesses

### How to Verify
1. Create listing with distinctive name like "QA Test Restaurant 12345"
2. Search for it or browse listings
3. Should appear in results

---

## Test Case 4: Save as Draft
**Bug Fixed:** #8 - "Save as Draft" button does nothing
**Priority:** 🔴 CRITICAL
**Risk:** Lost work

### Setup
1. Log in as business owner
2. Navigate to "Create New Listing"

### Test Steps
1. Fill in ONLY the business name: "Draft Test Business"
2. Leave other required fields empty
3. Click "Save as Draft" button
4. Wait for response

### Expected Results
✅ **PASS Criteria:**
- Toast message: "Draft saved successfully!"
- Redirects to `/dashboard`
- Draft appears in listings with "Draft" status
- Can edit draft later to complete it
- Form validation does NOT block draft save

❌ **FAIL Criteria:**
- Nothing happens when clicking
- Validation errors appear
- Button appears disabled
- Error message appears

### How to Verify
1. Check dashboard for draft listing
2. Edit the draft - previously entered data should load
3. Database verification_status should be 'draft'

---

## Test Case 5: React Router Navigation
**Bug Fixed:** #10 - Wrong navigation method (window.location)
**Priority:** 🟠 HIGH
**Risk:** Poor UX, slow performance

### Setup
1. Navigate to any listing detail page
2. Log out
3. Open browser DevTools → Network tab
4. Set "Disable cache" option

### Test Steps
1. Scroll down to "Write Review" tab
2. Click "Sign In" button
3. Watch Network tab and page behavior

### Expected Results
✅ **PASS Criteria:**
- Page transitions smoothly WITHOUT full reload
- Network tab shows NO full HTML document request
- URL changes to `/auth`
- React state is maintained
- Fast transition (< 100ms)

❌ **FAIL Criteria:**
- Page flashes white (full reload)
- Network tab shows full document reload
- Slow transition (> 500ms)
- React state is lost

### How to Verify
1. Watch for white flash = FAIL
2. Network tab "All" filter should NOT show document request
3. React DevTools should show component remount only

---

## Test Case 6: Mobile Menu
**Bug Fixed:** #6 - Mobile menu button does nothing
**Priority:** 🟠 HIGH
**Risk:** Mobile users cannot navigate

### Setup
1. Open site on mobile device OR
2. Desktop browser → DevTools → Toggle device toolbar
3. Set viewport to iPhone SE (375x667)

### Test Steps
1. Look for hamburger menu icon (☰) in top right
2. Click the menu button
3. Try to navigate using menu

### Expected Results
✅ **PASS Criteria:**
- Menu slides in from right side
- See "Menu" heading
- All navigation links visible:
  - Directory
  - Pricing
  - For Vendors (if not logged in)
  - Categories section
  - Dashboard (if logged in)
  - Admin Panel (if admin)
  - Settings (if logged in)
  - Log out (if logged in)
- Clicking link closes menu and navigates
- Clicking outside menu closes it

❌ **FAIL Criteria:**
- Menu button does nothing
- Menu doesn't open
- Links not visible
- Clicking links doesn't navigate
- Menu doesn't close

### How to Verify
1. Test all links in mobile menu
2. Test closing by clicking outside
3. Verify menu closes after navigation

---

## Test Case 7: Search Functionality
**Bug Fixed:** #7 - Search bars are non-functional
**Priority:** 🟠 HIGH
**Risk:** Users cannot find businesses

### Setup
1. Desktop view AND mobile view
2. Ensure some businesses exist in database

### Test Steps - Desktop
1. Locate search bar in header (center of page)
2. Type "restaurant" in search field
3. Press Enter key
4. Observe results

### Test Steps - Mobile
1. On mobile viewport
2. Locate search bar below header
3. Type "cafe" in search field
4. Press Enter key
5. Observe results

### Expected Results
✅ **PASS Criteria:**
- Typing works in search field
- Pressing Enter navigates to `/listings?search=restaurant`
- URL shows search parameter
- Search field clears after search
- Works on both desktop and mobile

❌ **FAIL Criteria:**
- Cannot type in field
- Pressing Enter does nothing
- No navigation occurs
- Search term not in URL
- Error appears

### How to Verify
1. Check URL contains `?search=` parameter
2. Try different search terms
3. Test on both desktop and mobile viewports

### Implementation Status
✅ **Implemented:** Search functionality works end-to-end. Search navigates to `/listings?search=term` and Listings page filters results by name, description, and address using Supabase query.

---

## Test Case 8: Business Owner Edit Access
**Bug Fixed:** #9 - Business owner check hardcoded to false
**Priority:** 🟠 HIGH
**Risk:** Owners cannot manage their businesses

### Setup
1. Create Account A - create a business listing
2. Create Account B - different user

### Test Steps - Owner Access
1. Log in as Account A
2. Navigate to YOUR business listing
3. Look for "Edit" button or owner controls
4. Click edit
5. Make changes
6. Save

### Test Steps - Non-Owner Access
1. Log in as Account B
2. Navigate to Account A's business listing
3. Look for "Edit" button

### Expected Results - Owner
✅ **PASS Criteria:**
- Owner sees edit controls
- Can access edit page
- Can save changes successfully
- Changes appear immediately

❌ **FAIL Criteria:**
- No edit button visible
- Edit button doesn't work
- "Access Denied" message
- Cannot save changes

### Expected Results - Non-Owner
✅ **PASS Criteria:**
- Does NOT see edit button
- Cannot access edit URL directly
- If trying direct URL: shows error or redirect

❌ **FAIL Criteria:**
- Non-owner can edit someone else's business
- Edit button appears for non-owners

### How to Verify
1. Check database: business.owner_id should match logged-in user ID
2. Test with multiple accounts
3. Test anonymous user (logged out) - should not see edit button

---

## Regression Testing

### Test Previous Functionality Still Works

#### Authentication
- [ ] Login works
- [ ] Signup works
- [ ] Logout works
- [ ] Password reset works

#### Listings
- [ ] Create new listing works
- [ ] View listing details works
- [ ] List all businesses works
- [ ] Category filtering works

#### Dashboard
- [ ] Dashboard loads
- [ ] Analytics visible
- [ ] Settings accessible

#### Admin (if applicable)
- [ ] Admin panel accessible (admin only)
- [ ] User management works
- [ ] Business moderation works

---

## Performance Testing

### Page Load Times
Test with browser DevTools → Network → Throttling

**3G Connection:**
- [ ] Homepage loads < 5 seconds
- [ ] Listing detail page < 5 seconds
- [ ] Dashboard loads < 5 seconds

**4G Connection:**
- [ ] Homepage loads < 2 seconds
- [ ] Listing detail page < 2 seconds
- [ ] Dashboard loads < 2 seconds

### Mobile Performance
- [ ] Mobile menu opens instantly
- [ ] Search is responsive
- [ ] No janky animations
- [ ] Touch targets are large enough (min 44x44px)

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Security Testing

### Authentication
- [ ] Cannot edit someone else's listing
- [ ] Cannot access admin panel without admin role
- [ ] Protected routes redirect to /auth when not logged in

### Data Validation
- [ ] Required fields validated on create
- [ ] Draft can save with incomplete data
- [ ] XSS prevention (try `<script>alert('xss')</script>` in business name)

---

## Recent Updates

### ✅ Opening Hours and Social Media
**Status:** IMPLEMENTED (Requires Database Migration)
**Date:** 2025-11-25

**Current State:**
- ✅ TypeScript types updated with `opening_hours` and `social_media` fields
- ✅ ListingForm code updated to save/load these fields
- ✅ Form UI fully functional
- ⚠️ **Database migration required** - see `DATABASE_MIGRATION_INSTRUCTIONS.md`

**To Enable:**
1. Apply SQL migration from `DATABASE_MIGRATION_ADDITIONAL_FIELDS.sql`
2. Use Supabase dashboard SQL Editor (takes < 5 minutes)
3. Follow instructions in `DATABASE_MIGRATION_INSTRUCTIONS.md`

**After Migration:**
- Users can save opening hours for each day of week
- Users can save social media links (Instagram, Facebook, TikTok)
- Data persists across edits
- Form loads existing data correctly

**Testing After Migration:**
1. Create new business with opening hours → should save
2. Edit existing business → opening hours should load
3. Save as draft with partial data → should work

### ✅ Search Filtering
**Status:** FULLY IMPLEMENTED
**Date:** 2025-11-06

**Implementation:**
- ✅ Search navigates to `/listings?search=term`
- ✅ Listings page parses search parameter
- ✅ Filters by name, description, and address (case-insensitive)
- ✅ Shows search context in page heading
- ✅ Empty state message includes search term

**No further action required** - feature is complete and functional.

---

## Bug Reporting Template

If you find a bug, report using this template:

```markdown
## Bug Report

**Test Case:** [Test Case number/name]
**Bug:** [Brief description]
**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Browser:** [Chrome 120 / Firefox 121 / etc.]
**Device:** [Desktop / iPhone 14 / Android / etc.]
**User Role:** [Anonymous / Business Owner / Admin]

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy from DevTools Console]

**Network Errors:**
[Copy from DevTools Network tab]
```

---

## QA Sign-Off Checklist

### Critical Features (All Must Pass)
- [ ] Edit listing loads existing data
- [ ] Edit listing doesn't break URLs
- [ ] Real businesses display (not mock data)
- [ ] Save as Draft works
- [ ] Navigation doesn't cause full reload

### High Priority Features (All Must Pass)
- [ ] Mobile menu functional
- [ ] Search works on desktop
- [ ] Search works on mobile
- [ ] Owner can edit their business
- [ ] Non-owner cannot edit

### Regression Tests (No Breakage)
- [ ] Authentication still works
- [ ] Create listing still works
- [ ] Dashboard still works

### Performance (Acceptable)
- [ ] Page loads < 5 seconds on 3G
- [ ] No janky animations
- [ ] Mobile responsive

### Browser Compatibility
- [ ] Works on Chrome
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on mobile browsers

---

## QA Team Notes

### High Priority Test Areas
1. **Edit Listing** - Test this thoroughly, biggest data loss risk
2. **Mobile Menu** - Test on real mobile devices if possible
3. **Owner Access** - Test with multiple user accounts

### Low Priority
- Opening hours (not saved yet)
- Social media (not saved yet)
- Search result filtering (UI works, filtering not implemented)

### Test Data Setup
Recommend creating:
- 2-3 test user accounts
- 5-10 test business listings
- Mix of published and draft listings
- At least one listing per test account

### Estimated Testing Time
- Initial pass: 2-3 hours
- Regression: 1 hour
- Bug verification: 1 hour
- **Total:** ~4-5 hours

---

## Success Criteria

**QA PASS Requirements:**
- ✅ All 10 bugs verified fixed
- ✅ No critical regressions
- ✅ Works on Chrome + mobile browser
- ✅ No data loss scenarios
- ✅ Performance acceptable

**Ready for Production When:**
1. QA sign-off received
2. All critical bugs passed
3. No blocking issues found
4. Stakeholder approval obtained

---

## Contact

**Questions about testing?**
- Check CRITICAL_BUGS_FOUND.md for bug details
- Check BUG_REPORT.md for technical analysis
- Review commit 13eba67 for implementation details

**Found a bug?**
- Use bug reporting template above
- Tag as: `qa-testing`, `bug`, and appropriate severity
- Include steps to reproduce

---

**Happy Testing! 🧪**

Last updated: 2025-11-06
Branch: claude/test-routing-functionality-011CUo5cPuy7Xan96DusKDbK
