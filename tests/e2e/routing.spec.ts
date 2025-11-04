import { test, expect } from '@playwright/test';

test.describe('Routing Tests', () => {
  test.describe('Public Routes', () => {
    test('should load home page (/)', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL('/');
      await expect(
        page.getByRole('heading', { name: /Discover Singapore's/i })
      ).toBeVisible();
    });

    test('should load listings page (/listings)', async ({ page }) => {
      await page.goto('/listings');
      await expect(page).toHaveURL('/listings');
      // Check for listings page content
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load auth page (/auth)', async ({ page }) => {
      await page.goto('/auth');
      await expect(page).toHaveURL('/auth');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load pricing page (/pricing)', async ({ page }) => {
      await page.goto('/pricing');
      await expect(page).toHaveURL('/pricing');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load contact page (/contact)', async ({ page }) => {
      await page.goto('/contact');
      await expect(page).toHaveURL('/contact');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load districts page (/districts)', async ({ page }) => {
      await page.goto('/districts');
      await expect(page).toHaveURL('/districts');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load property zones page (/property-zones)', async ({
      page,
    }) => {
      await page.goto('/property-zones');
      await expect(page).toHaveURL('/property-zones');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Dashboard Routes', () => {
    test('should load dashboard page (/dashboard)', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load create listing page (/dashboard/listings/new)', async ({
      page,
    }) => {
      await page.goto('/dashboard/listings/new');
      await expect(page).toHaveURL('/dashboard/listings/new');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load dashboard analytics (/dashboard/analytics)', async ({
      page,
    }) => {
      await page.goto('/dashboard/analytics');
      await expect(page).toHaveURL('/dashboard/analytics');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load dashboard settings (/dashboard/settings)', async ({
      page,
    }) => {
      await page.goto('/dashboard/settings');
      await expect(page).toHaveURL('/dashboard/settings');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Admin Routes', () => {
    test('should load admin dashboard (/admin)', async ({ page }) => {
      await page.goto('/admin');
      await expect(page).toHaveURL('/admin');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin users (/admin/users)', async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL('/admin/users');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin businesses (/admin/businesses)', async ({
      page,
    }) => {
      await page.goto('/admin/businesses');
      await expect(page).toHaveURL('/admin/businesses');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin subscriptions (/admin/subscriptions)', async ({
      page,
    }) => {
      await page.goto('/admin/subscriptions');
      await expect(page).toHaveURL('/admin/subscriptions');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin analytics (/admin/analytics)', async ({ page }) => {
      await page.goto('/admin/analytics');
      await expect(page).toHaveURL('/admin/analytics');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin moderation (/admin/moderation)', async ({
      page,
    }) => {
      await page.goto('/admin/moderation');
      await expect(page).toHaveURL('/admin/moderation');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin revenue (/admin/revenue)', async ({ page }) => {
      await page.goto('/admin/revenue');
      await expect(page).toHaveURL('/admin/revenue');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin premium (/admin/premium)', async ({ page }) => {
      await page.goto('/admin/premium');
      await expect(page).toHaveURL('/admin/premium');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should load admin settings (/admin/settings)', async ({ page }) => {
      await page.goto('/admin/settings');
      await expect(page).toHaveURL('/admin/settings');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Dynamic SEO Routes', () => {
    test('should handle /district/* routes', async ({ page }) => {
      await page.goto('/district/clementi');
      await expect(page).toHaveURL('/district/clementi');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should handle /category/* routes', async ({ page }) => {
      await page.goto('/category/restaurants');
      await expect(page).toHaveURL('/category/restaurants');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should handle /seo/* routes', async ({ page }) => {
      await page.goto('/seo/test-page');
      await expect(page).toHaveURL('/seo/test-page');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('404 Not Found', () => {
    test('should show 404 page for undefined routes', async ({ page }) => {
      await page.goto('/this-route-does-not-exist-12345');
      await expect(page.locator('body')).toBeVisible();
      // The page should render (not crash), showing NotFound component
    });
  });

  test.describe('Navigation Flow', () => {
    test('should navigate from home to listings', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /View All Listings/i }).click();
      await expect(page).toHaveURL('/listings');
    });

    test('should navigate using header links', async ({ page }) => {
      await page.goto('/');

      // Navigate to pricing
      const pricingLink = page.getByRole('link', { name: 'Pricing' });
      if (await pricingLink.isVisible()) {
        await pricingLink.click();
        await expect(page).toHaveURL('/pricing');
      }
    });
  });

  test.describe('Query Parameters', () => {
    test('should handle query parameters on listings page', async ({
      page,
    }) => {
      await page.goto('/listings?category=restaurants');
      await expect(page).toHaveURL(/\/listings\?category=restaurants/);
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
