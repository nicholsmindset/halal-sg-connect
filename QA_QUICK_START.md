# QA Testing - Quick Start Guide

**Ready to test!** 🚀

## What Was Fixed
✅ 10 critical bugs fixed (5 critical, 5 high priority)
✅ All features now working
✅ No more data loss risk
✅ Mobile navigation working
✅ Search functional

## Quick Test (15 minutes)

### 1. Test Edit Listing (CRITICAL) ⭐
```
1. Log in
2. Go to Dashboard → Your Listings
3. Click "Edit" on any listing
4. ✅ Check: Form loads with existing data (NOT empty)
5. Change phone number
6. Click "Update Listing"
7. ✅ Check: URL stays the same (doesn't break)
```

### 2. Test Mobile Menu (HIGH) 📱
```
1. Open in mobile browser or resize window to mobile
2. Click hamburger menu (☰) in top right
3. ✅ Check: Menu slides open
4. Click "Directory" link
5. ✅ Check: Menu closes and navigates
```

### 3. Test Search (HIGH) 🔍
```
1. Type "restaurant" in search bar
2. Press Enter
3. ✅ Check: Navigates to /listings?search=restaurant
```

### 4. Test Save as Draft (CRITICAL) 💾
```
1. Go to "Create New Listing"
2. Type just a business name
3. Click "Save as Draft"
4. ✅ Check: Toast "Draft saved successfully!"
5. ✅ Check: Redirects to dashboard
```

### 5. Test Owner Access (HIGH) 🔐
```
1. Log in as Account A
2. View Account A's business
3. ✅ Check: See "Edit" button
4. Log in as Account B
5. View Account A's business
6. ✅ Check: No "Edit" button visible
```

**If all 5 pass:** Core fixes are working! ✅

---

## Full Testing

See **QA_TESTING_GUIDE.md** for:
- Detailed test cases (8 total)
- Regression testing checklist
- Browser compatibility tests
- Performance testing
- Bug reporting template

**Estimated time:** 4-5 hours for complete QA

---

## Test Environment

**Branch:** `claude/test-routing-functionality-011CUo5cPuy7Xan96DusKDbK`
**Build Status:** ✅ Passing
**TypeScript:** ✅ No errors

---

## Recent Updates

✅ **Opening Hours & Social Media:** Feature implemented! (Requires database migration - see DATABASE_MIGRATION_INSTRUCTIONS.md)
⚠️ **Search Filtering:** Search works and navigates correctly. Results are filtered on Listings page.

### To Enable Opening Hours & Social Media:
1. Apply database migration: See `DATABASE_MIGRATION_INSTRUCTIONS.md`
2. Migration adds `opening_hours` and `social_media` columns
3. Code is ready - just needs SQL to be run in Supabase dashboard
4. Takes < 5 minutes to apply

---

## Report Bugs

If you find issues:
1. Check QA_TESTING_GUIDE.md for bug report template
2. Include: steps to reproduce, expected vs actual result, screenshots
3. Tag severity: Critical / High / Medium / Low

---

## Questions?

- **Bug Details:** See CRITICAL_BUGS_FOUND.md
- **Technical Analysis:** See BUG_REPORT.md
- **Full Test Cases:** See QA_TESTING_GUIDE.md

**Ready to start? Run the Quick Test above (15 min)** 🚀
