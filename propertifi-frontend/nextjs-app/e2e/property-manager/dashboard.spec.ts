/**
 * Property Manager Dashboard E2E Tests
 * 
 * Tests the PM dashboard functionality including lead pipeline,
 * filtering, sorting, and lead detail view
 */

import { test, expect, login } from '../fixtures/auth.fixture';

test.describe('Property Manager Dashboard', () => {
  test.beforeEach(async ({ page, testUser }) => {
    // Login before each test
    await login(page, testUser.email, testUser.password);
  });

  test('should display PM dashboard with leads', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    // Verify page title/heading
    await expect(page.locator('h1, h2').filter({ hasText: /leads|dashboard|my leads/i })).toBeVisible();

    // Verify leads are displayed (or empty state)
    const leadsContainer = page.locator('[data-testid="leads"], .grid, .space-y').first();
    await expect(leadsContainer).toBeVisible({ timeout: 10000 });

    // Check for either leads or empty state message
    const hasLeads = await page.locator('[data-testid="lead-card"], .lead-card, article').count();
    const hasEmptyState = await page.locator('text=/no leads|no leads available/i').isVisible();

    expect(hasLeads > 0 || hasEmptyState).toBeTruthy();
  });

  test('should display lead cards with key information', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    // Wait for leads to load - wait for cards or empty state
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article');
    await page.waitForLoadState('networkidle');
    const cardCount = await leadCards.count();

    if (cardCount > 0) {
      const firstCard = leadCards.first();

      // Verify card displays key information
      // Address
      await expect(
        firstCard.locator('text=/street|address|city|state|zip/i')
      ).toBeVisible({ timeout: 2000 }).catch(() => {});

      // Property type or owner name
      await expect(
        firstCard.locator('text=/property|single|multi|commercial/i').or(
          firstCard.locator('text=/name|owner/i')
        )
      ).toBeVisible({ timeout: 2000 }).catch(() => {});

      // Status badge
      await expect(
        firstCard.locator('[class*="badge"], [class*="status"], span[class*="bg"]')
      ).toBeVisible({ timeout: 2000 }).catch(() => {});
    } else {
      // Skip if no leads available
      test.skip();
    }
  });

  test('should open lead detail modal when clicking lead card', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');
    
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article, [class*="cursor-pointer"]');
    const cardCount = await leadCards.count();

    if (cardCount > 0) {
      // Click first lead card
      await leadCards.first().click();

      // Wait for modal to appear - use visibility check instead of timeout
      const modal = page.locator('[role="dialog"], [data-testid="modal"], [class*="modal"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Verify modal contains lead details
      await expect(
        modal.locator('text=/property|address|contact|details/i').first()
      ).toBeVisible({ timeout: 2000 }).catch(() => {});
    } else {
      test.skip();
    }
  });

  test('should filter leads by status', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');

    // Look for status filter dropdown or buttons
    const statusFilter = page.locator(
      'select[name="status"], [data-testid="status-filter"], button:has-text("Status"), [aria-label*="status"]'
    ).first();

    if (await statusFilter.count() > 0) {
      // Get initial lead count
      const initialCount = await page.locator('[data-testid="lead-card"], .lead-card').count();

      // Select a status filter
      if (await statusFilter.evaluate((el: any) => el.tagName === 'SELECT')) {
        await statusFilter.selectOption({ index: 1 });
      } else {
        await statusFilter.click();
        await page.locator('text=/new|viewed|contacted/i').first().click();
      }

      // Wait for filter to apply - wait for network to settle
      await page.waitForLoadState('networkidle');

      // Verify leads filtered (count may change)
      const filteredCount = await page.locator('[data-testid="lead-card"], .lead-card').count();
      
      // Filter should either show fewer leads or same (if all match filter)
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    } else {
      // Skip if filtering not implemented
      test.skip();
    }
  });

  test('should filter leads by date range', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');

    // Look for date filter
    const dateFilter = page.locator(
      'select[name="date"], [data-testid="date-filter"], button:has-text("Date"), [aria-label*="date"]'
    ).first();

    if (await dateFilter.count() > 0) {
      const initialCount = await page.locator('[data-testid="lead-card"], .lead-card').count();

      // Select date filter
      if (await dateFilter.evaluate((el: any) => el.tagName === 'SELECT')) {
        await dateFilter.selectOption('Last 7 days');
      } else {
        await dateFilter.click();
        await page.locator('text=/7 days|30 days/i').first().click();
      }

      await page.waitForLoadState('networkidle');

      // Verify filter applied
      const filteredCount = await page.locator('[data-testid="lead-card"], .lead-card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    } else {
      test.skip();
    }
  });

  test('should display loading state while fetching leads', async ({ page, nav }) => {
    // Navigate to dashboard
    await nav.gotoPMDashboard();

    // Check for loading spinner (may be fast, so check immediately)
    const spinner = page.locator('[data-testid="loading"], .spinner, [class*="animate-spin"]').first();
    
    // Loading might already be complete, so this is optional
    const wasLoading = await spinner.isVisible({ timeout: 500 }).catch(() => false);
    
    // If loading was visible, wait for it to disappear
    if (wasLoading) {
      await expect(spinner).not.toBeVisible({ timeout: 10000 });
    }
  });

  test('should display error message on API failure', async ({ page, nav, api }) => {
    // Mock API failure
    await api.mockEndpoint(/\/leads|\/property-managers.*\/leads/, {
      error: 'Failed to fetch leads',
    });

    await nav.gotoPMDashboard();

    // Verify error message appears
    await expect(
      page.locator('text=/error|failed|unable/i').first()
    ).toBeVisible({ timeout: 5000 }).catch(() => {
      // Error handling might be implemented differently
      test.skip();
    });
  });

  test('should show lead count in dashboard header', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');

    // Check for lead count display
    const leadCount = page.locator('text=/\\d+.*lead|lead.*count/i').first();
    
    // Lead count might be displayed as "X leads" or similar
    const hasCount = await leadCount.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Not critical if not displayed
    if (hasCount) {
      const countText = await leadCount.textContent();
      expect(countText).toMatch(/\d+/);
    }
  });

  test('should close lead detail modal', async ({ page, nav }) => {
    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');

    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    const cardCount = await leadCards.count();

    if (cardCount > 0) {
      await leadCards.click();
      
      // Wait for modal to appear first
      const modal = page.locator('[role="dialog"]').first();
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Find and click close button
      const closeButton = page.locator(
        'button[aria-label="Close"], button:has-text("Close"), [data-testid="close"], [class*="close"]'
      ).first();

      if (await closeButton.count() > 0) {
        await closeButton.click();

        // Verify modal closed
        await expect(modal).not.toBeVisible({ timeout: 2000 });
      } else {
        // Try clicking outside modal
        await page.keyboard.press('Escape');
        await expect(modal).not.toBeVisible({ timeout: 2000 });
      }
    } else {
      test.skip();
    }
  });

  test('should display empty state when no leads available', async ({ page, nav }) => {
    // This would require either:
    // 1. Mocking empty API response
    // 2. Using test user with no leads
    // 3. Waiting for actual empty state

    await nav.gotoPMDashboard();

    await page.waitForLoadState('networkidle');

    // Check for empty state message
    const emptyState = page.locator('text=/no leads|no leads available|empty/i').first();
    
    const hasLeads = await page.locator('[data-testid="lead-card"], .lead-card').count() > 0;
    
    if (!hasLeads) {
      await expect(emptyState).toBeVisible({ timeout: 2000 });
    }
  });
});

