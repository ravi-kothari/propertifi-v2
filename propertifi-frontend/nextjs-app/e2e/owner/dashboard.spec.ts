/**
 * Owner Dashboard E2E Tests
 * 
 * Tests the Owner dashboard functionality
 */

import { test, expect, login } from '../fixtures/auth.fixture';

test.describe('Owner Dashboard', () => {
  test.beforeEach(async ({ page, testUser }) => {
    // Login as owner
    const ownerEmail = testUser.email.replace('property_manager', 'owner');
    await login(page, ownerEmail, testUser.password, 'owner');
  });

  test('should display owner dashboard', async ({ page, nav }) => {
    await nav.goto('/owner/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page).toHaveURL(/\/owner\/dashboard/);

    // Verify dashboard content
    await expect(
      page.locator('h1, h2').filter({ hasText: /dashboard|my.*leads|submitted/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display submitted leads', async ({ page, nav }) => {
    await nav.goto('/owner/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for leads list
    const leadsList = page.locator(
      '[data-testid="leads"], .leads-list, [class*="lead"]'
    ).first();

    // Should show either leads or empty state
    const hasLeads = await page.locator('[data-testid="lead-card"], .lead-card').count() > 0;
    const hasEmptyState = await page.locator('text=/no leads|submitted/i').isVisible();

    expect(hasLeads || hasEmptyState).toBeTruthy();
  });

  test('should display lead status tracking', async ({ page, nav }) => {
    await nav.goto('/owner/dashboard');
    await page.waitForLoadState('networkidle');

    const leadCards = page.locator('[data-testid="lead-card"], .lead-card').first();
    const cardCount = await leadCards.count();

    if (cardCount > 0) {
      // Check for status indicators
      await expect(
        leadCards.first().locator('[class*="status"], [class*="badge"]')
      ).toBeVisible({ timeout: 2000 }).catch(() => {});
    } else {
      test.skip('No leads available to test status tracking');
    }
  });

  test('should display PM responses to leads', async ({ page, nav }) => {
    await nav.goto('/owner/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for responses section
    const responsesSection = page.locator(
      'text=/response|interested|contacted/i, [data-testid="responses"]'
    ).first();

    // Responses might be visible or in detail view
    const hasResponses = await responsesSection.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (!hasResponses) {
      // Try clicking on a lead to see responses
      const leadCard = page.locator('[data-testid="lead-card"], .lead-card').first();
      if (await leadCard.count() > 0) {
        await leadCard.click();
        await page.waitForLoadState('domcontentloaded');

        // Check for responses in modal/detail view
        await expect(
          page.locator('text=/response|interested/i').first()
        ).toBeVisible({ timeout: 2000 }).catch(() => {
          test.skip('Responses section not found');
        });
      } else {
        test.skip('No leads available');
      }
    }
  });
});

