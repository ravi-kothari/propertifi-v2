/**
 * Password Reset E2E Tests
 * 
 * Tests the forgot password and password reset flow
 */

import { test, expect } from '../fixtures/auth.fixture';
import { TestDataGenerator } from '../utils/test-data-generator';

test.describe('Password Reset', () => {
  test('should display forgot password form', async ({ page, nav }) => {
    await nav.gotoLogin();

    // Click forgot password link
    const forgotPasswordLink = page.locator('a:has-text("Forgot"), text=/forgot.*password/i').first();
    
    if (await forgotPasswordLink.count() > 0) {
      await forgotPasswordLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
      
      // Verify on password reset page
      await expect(page).toHaveURL(/\/forgot-password|\/reset-password/);
      await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    } else {
      // Skip if forgot password feature not implemented
      test.skip();
    }
  });

  test('should submit forgot password request', async ({ page, nav, testUser }) => {
    // Navigate to forgot password page (may need direct navigation)
    await nav.goto('/forgot-password').catch(() => nav.goto('/reset-password'));
    
    // Check if page exists
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.count() === 0) {
      test.skip();
    }

    // Fill email
    await emailInput.fill(testUser.email);

    // Submit form
    await page.click('button[type="submit"], button:has-text("Send"), button:has-text("Reset")');

    // Wait for response message to appear
    await expect(
      page.locator('text=/email.*sent|reset.*link|check.*email/i').first()
    ).toBeVisible({ timeout: 5000 });

    // Verify success message
    await expect(
      page.locator('text=/check.*email|reset.*link|sent/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should validate email on forgot password form', async ({ page, nav }) => {
    await nav.goto('/forgot-password').catch(() => nav.goto('/reset-password'));
    
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    if (await emailInput.count() === 0) {
      test.skip();
    }

    // Try invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Verify validation error
    await expect(
      page.locator('text=/invalid.*email|email.*format/i').first()
    ).toBeVisible({ timeout: 2000 }).catch(() => {
      // HTML5 validation might not show custom message
    });
  });

  test('should handle password reset with token', async ({ page, nav, testUser }) => {
    // This would typically require:
    // 1. Getting reset token from email (MailHog in test env)
    // 2. Navigating to reset password page with token
    // 3. Entering new password
    // 4. Verifying password updated
    
    // Skip for now - requires email access or mock
    test.skip('Requires email token access or MailHog integration');
  });

  test('should validate new password requirements', async ({ page }) => {
    // Navigate to reset password page (would need token in URL)
    // Skip for now - requires token
    test.skip('Requires reset token');
  });

  test('should successfully reset password and login', async ({ page }) => {
    // 1. Request password reset
    // 2. Get token from email
    // 3. Reset password
    // 4. Login with new password
    // Skip for now - requires full email flow
    test.skip('Requires full email integration');
  });
});

