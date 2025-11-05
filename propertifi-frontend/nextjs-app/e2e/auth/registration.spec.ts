/**
 * User Registration E2E Tests
 * 
 * Tests the complete user registration flow including form validation,
 * API integration, and post-registration behavior
 */

import { test, expect } from '../fixtures/auth.fixture';
import { TestDataGenerator } from '../utils/test-data-generator';

test.describe('User Registration', () => {
  test('should successfully register a new property manager', async ({ page, nav, dom, testUser }) => {
    // Navigate to registration page
    await nav.gotoRegister();

    // Verify page loaded
    await expect(page).toHaveTitle(/register|sign up/i);

    // Fill registration form
    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', testUser.email);
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"], input[name="passwordConfirmation"]', testUser.password);

    // Submit form
    await dom.clickButton('button[type="submit"], button:has-text("Register"), button:has-text("Sign up")', {
      waitForNavigation: true,
    });

    // Verify redirect (either to login or dashboard)
    await expect(page).toHaveURL(/\/login|\/property-manager|\/dashboard/);

    // Verify success message or email verification notice
    const pageContent = await page.textContent('body');
    expect(pageContent).toMatch(/verify|check your email|success|registered/i);
  });

  test('should validate required fields', async ({ page, nav, dom }) => {
    await nav.gotoRegister();

    // Try to submit empty form
    await dom.clickButton('button[type="submit"]');

    // Verify validation errors appear
    await expect(page.locator('text=/name.*required|email.*required|password.*required/i').first()).toBeVisible();
  });

  test('should validate email format', async ({ page, nav, dom, testUser }) => {
    await nav.gotoRegister();

    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', 'invalid-email');
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"]', testUser.password);

    // Blur email field to trigger validation
    await page.locator('input[name="email"]').blur();

    // Verify email validation error
    await expect(page.locator('text=/invalid.*email|email.*format/i').first()).toBeVisible();
  });

  test('should validate password strength', async ({ page, nav, dom, testUser }) => {
    await nav.gotoRegister();

    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', testUser.email);
    await dom.fillField('input[name="password"]', 'weak');
    await dom.fillField('input[name="password_confirmation"]', 'weak');

    // Blur password field
    await page.locator('input[name="password"]').blur();

    // Verify password strength error
    await expect(
      page.locator('text=/password.*8|at least.*characters|uppercase|number/i').first()
    ).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page, nav, dom, testUser }) => {
    await nav.gotoRegister();

    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', testUser.email);
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"]', 'DifferentPassword123!');

    // Submit form
    await dom.clickButton('button[type="submit"]');

    // Verify password mismatch error
    await expect(page.locator('text=/password.*match|don\'t match/i').first()).toBeVisible();
  });

  test('should handle duplicate email registration', async ({ page, nav, dom, testUser }) => {
    // First registration
    await nav.gotoRegister();
    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', testUser.email);
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"]', testUser.password);
    await dom.clickButton('button[type="submit"]');
    
    // Wait for first registration to complete
    await page.waitForLoadState('networkidle');

    // Try to register again with same email
    await nav.gotoRegister();
    await dom.fillField('input[name="name"]', 'Another Name');
    await dom.fillField('input[name="email"]', testUser.email); // Same email
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"]', testUser.password);
    await dom.clickButton('button[type="submit"]');

    // Verify error message about existing email
    await expect(page.locator('text=/email.*already|already.*registered|exists/i').first()).toBeVisible();
  });

  test('should persist user session after registration', async ({ page, nav, dom, testUser }) => {
    await nav.gotoRegister();
    await dom.fillField('input[name="name"]', testUser.name);
    await dom.fillField('input[name="email"]', testUser.email);
    await dom.fillField('input[name="password"]', testUser.password);
    await dom.fillField('input[name="password_confirmation"]', testUser.password);
    await dom.clickButton('button[type="submit"]', { waitForNavigation: true });

    // If redirected to dashboard, check localStorage for auth
    if (page.url().includes('/property-manager') || page.url().includes('/dashboard')) {
      const auth = await page.evaluate(() => localStorage.getItem('auth'));
      expect(auth).toBeTruthy();
      expect(auth).toContain('token');
    }
  });
});

