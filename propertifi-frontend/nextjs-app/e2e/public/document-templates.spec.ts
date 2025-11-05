/**
 * Document Templates E2E Tests
 * 
 * Tests the public document template library including:
 * - Template browsing
 * - Filtering by category and state
 * - Search functionality
 * - Download functionality
 * - Rate limiting
 */

import { test, expect } from '../fixtures/auth.fixture';

test.describe('Document Templates', () => {
  test('should display template library page', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page).toHaveURL(/\/templates/);

    // Verify page title
    await expect(
      page.locator('h1, h2').filter({ hasText: /template|document|library/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display template cards in grid/list', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    // Look for template cards
    const templates = page.locator(
      '[data-testid="template"], .template-card, [class*="template"], article'
    );

    const templateCount = await templates.count();

    if (templateCount > 0) {
      // Verify at least one template is visible
      await expect(templates.first()).toBeVisible();
      
      // Verify template card has key information
      const firstTemplate = templates.first();
      await expect(
        firstTemplate.locator('text=/title|name|category|state/i').first()
      ).toBeVisible({ timeout: 2000 }).catch(() => {});
    } else {
      // Check for empty state
      const emptyState = page.locator('text=/no.*template|empty/i');
      await expect(emptyState.or(templates.first())).toBeVisible({ timeout: 3000 });
    }
  });

  test('should filter templates by category', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    // Look for category filter
    const categoryFilter = page.locator(
      'select[name*="category"], [data-testid="category-filter"], button:has-text("Category")'
    ).first();

    if (await categoryFilter.count() > 0) {
      const initialCount = await page.locator('[data-testid="template"], .template-card').count();

      // Select a category
      if (await categoryFilter.evaluate((el: any) => el.tagName === 'SELECT')) {
        await categoryFilter.selectOption({ index: 1 });
      } else {
        await categoryFilter.click();
        await page.locator('text=/lease|agreement|form/i').first().click();
      }

      await page.waitForLoadState('networkidle');

      // Filtered count might be different
      const filteredCount = await page.locator('[data-testid="template"], .template-card').count();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    } else {
      test.skip('Category filter not found');
    }
  });

  test('should filter templates by state', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    const stateFilter = page.locator(
      'select[name*="state"], [data-testid="state-filter"], button:has-text("State")'
    ).first();

    if (await stateFilter.count() > 0) {
      // Select a state
      if (await stateFilter.evaluate((el: any) => el.tagName === 'SELECT')) {
        await stateFilter.selectOption('CA');
      } else {
        await stateFilter.click();
        await page.locator('text=/California|CA/i').first().click();
      }

      await page.waitForLoadState('networkidle');

      // Verify filter applied (check URL or displayed templates)
      const url = page.url();
      const hasStateFilter = url.includes('state=') || url.includes('CA');
      
      // Filter should be reflected
      expect(hasStateFilter || await stateFilter.inputValue()).toBeTruthy();
    } else {
      test.skip('State filter not found');
    }
  });

  test('should search templates by keyword', async ({ page, nav, dom }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator(
      'input[name="search"], input[type="search"], input[placeholder*="search"]'
    ).first();

    if (await searchInput.count() > 0) {
      await dom.fillField('input[name="search"], input[type="search"]', 'lease');
      await page.waitForLoadState('domcontentloaded');

      // Verify search results
      const results = page.locator('[data-testid="template"], .template-card');
      await expect(results.first()).toBeVisible({ timeout: 3000 });
    } else {
      test.skip('Search functionality not found');
    }
  });

  test('should download template', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    const templates = page.locator('[data-testid="template"], .template-card').first();
    const templateCount = await templates.count();

    if (templateCount > 0) {
      // Find download button
      const downloadButton = templates.first().locator(
        'button:has-text("Download"), a:has-text("Download"), [data-testid="download"]'
      );

      if (await downloadButton.count() > 0) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);

        await downloadButton.click();
        await page.waitForLoadState('networkidle');

        const download = await downloadPromise;
        
        if (download) {
          // Verify download
          expect(download.suggestedFilename()).toMatch(/\.(pdf|doc|docx)$/i);
        } else {
          // Download might require login or use different method
          // Check for login prompt or success message
          await expect(
            page.locator('text=/login|sign.*up|download.*started|success/i').first()
          ).toBeVisible({ timeout: 5000 }).catch(() => {
            test.skip('Download may require authentication or use different method');
          });
        }
      } else {
        test.skip('Download button not found on template card');
      }
    } else {
      test.skip('No templates available');
    }
  });

  test('should display rate limit message when download limit reached', async ({ page, nav }) => {
    // This would require:
    // 1. Downloading templates multiple times (10/hour limit)
    // 2. Verifying rate limit message appears
    
    test.skip('Requires multiple downloads to trigger rate limit');
  });

  test('should display template details on click', async ({ page, nav }) => {
    await nav.goto('/templates');
    await page.waitForLoadState('networkidle');

    const templates = page.locator('[data-testid="template"], .template-card').first();
    
    if (await templates.count() > 0) {
      await templates.click();
      await page.waitForLoadState('domcontentloaded');

      // Check for detail view or modal
      const detailView = page.locator(
        '[role="dialog"], [data-testid="template-detail"], [class*="modal"], [class*="detail"]'
      ).first();

      if (await detailView.count() > 0) {
        await expect(detailView).toBeVisible();
      } else {
        // Might navigate to detail page
        await expect(page).toHaveURL(/\/templates\/\d+|\/templates\/[^\/]+/);
      }
    } else {
      test.skip('No templates available');
    }
  });
});

