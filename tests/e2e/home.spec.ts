import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load and display main elements', async ({ page }) => {
    await page.goto('/')

    // Check that the main heading is visible
    await expect(page.getByRole('heading', { name: /Discover Singapore's/i })).toBeVisible()
    await expect(page.getByText('Halal Businesses')).toBeVisible()

    // Check that the search input is present
    await expect(page.getByPlaceholder(/Search for halal businesses/i)).toBeVisible()

    // Check that categories are displayed
    await expect(page.getByText('Restaurants')).toBeVisible()
    await expect(page.getByText('Cafes & Bakeries')).toBeVisible()
  })

  test('should navigate to listings page', async ({ page }) => {
    await page.goto('/')

    // Click on a category or "View All" button
    await page.getByRole('link', { name: /View All Listings/i }).click()

    // Should navigate to listings page
    await expect(page).toHaveURL('/listings')
  })
})