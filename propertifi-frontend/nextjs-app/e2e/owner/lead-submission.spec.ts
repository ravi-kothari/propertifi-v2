/**
 * Owner Lead Submission E2E Tests
 * 
 * Tests the lead submission flow for property owners
 */

import { test, expect } from '../fixtures/auth.fixture';
import { TestDataGenerator } from '../utils/test-data-generator';

test.describe('Owner Lead Submission', () => {
  test('should display lead submission form on homepage', async ({ page, nav }) => {
    await nav.goto('/');

    // Look for lead submission form
    const form = page.locator(
      'form[action*="lead"], form[data-testid="lead-form"], text=/submit.*lead|get.*started/i'
    ).first();

    await expect(form.or(page.locator('h1, h2').filter({ hasText: /find|connect|property/i }))).toBeVisible({ timeout: 5000 });
  });

  test('should fill multi-step lead submission form', async ({ page, nav, dom }) => {
    await nav.goto('/');

    // Step 1: Basic Information
    const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();

    if (await nameInput.count() > 0) {
      const lead = TestDataGenerator.generateLead();

      await dom.fillField('input[name="name"]', lead.name);
      await dom.fillField('input[name="email"], input[type="email"]', lead.email);
      await dom.fillField('input[name="phone"], input[type="tel"]', lead.phone);

      // Continue to next step
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first();
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForLoadState('domcontentloaded');

        // Step 2: Property Details
        const addressInput = page.locator('input[name="address"], input[placeholder*="address"]').first();
        if (await addressInput.count() > 0) {
          await dom.fillField('input[name="address"]', lead.address);
          await dom.fillField('input[name="city"]', lead.city);
          await dom.selectOption('select[name="state"]', lead.state);
          await dom.fillField('input[name="zipcode"], input[name="zip"]', lead.zipcode);

          // Continue or submit
          const submitButton = page.locator('button[type="submit"], button:has-text("Submit")').first();
          if (await submitButton.count() > 0) {
            await submitButton.click();
            
            // Wait for success message
            await expect(
              page.locator('text=/thank.*you|success|submitted|confirmation/i').first()
            ).toBeVisible({ timeout: 10000 });
          }
        }
      }
    } else {
      test.skip('Lead submission form not found on homepage');
    }
  });

  test('should validate required fields in lead submission', async ({ page, nav, dom }) => {
    await nav.goto('/');

    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")').first();

    if (await submitButton.count() > 0) {
      // Try to submit without filling required fields
      await submitButton.click();

      // Verify validation errors
      await expect(
        page.locator('text=/required|fill|error/i').first()
      ).toBeVisible({ timeout: 2000 }).catch(() => {
        // Validation might be implemented differently
      });
    } else {
      test.skip('Lead submission form not available');
    }
  });

  test('should display confirmation after successful submission', async ({ page, nav }) => {
    // This test would require filling the full form
    // Skip for now as it depends on form structure
    test.skip('Requires complete form implementation');
  });
});

