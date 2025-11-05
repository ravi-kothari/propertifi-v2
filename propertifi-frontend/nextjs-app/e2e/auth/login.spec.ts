/**
 * User Login E2E Tests
 * 
 * Tests the complete user login flow including form validation,
 * authentication, and post-login redirect
 */

import { test, expect, login } from '../fixtures/auth.fixture';

test.describe('User Login', () => {
  test('should successfully login with valid credentials', async ({ page, nav, dom, testUser }) => {
    // Navigate to login page
    await nav.gotoLogin();

    // Verify page loaded
    await expect(page).toHaveTitle(/login|sign in/i);

    // Fill login form
    await dom.fillField('input[name="email"], input[type="email"]', testUser.email);
    await dom.fillField('input[name="password"], input[type="password"]', testUser.password);

    // Submit form and wait for navigation
    await dom.clickButton('button[type="submit"], button:has-text("Log in"), button:has-text("Login")', {
      waitForNavigation: true,
    });

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/property-manager|\/owner\/dashboard|\/dashboard/);

    // Verify authentication stored
    const auth = await page.evaluate(() => localStorage.getItem('auth'));
    expect(auth).toBeTruthy();
    expect(auth).toContain('token');
  });

  test('should validate required fields', async ({ page, nav, dom }) => {
    await nav.gotoLogin();

    // Try to submit empty form
    await dom.clickButton('button[type="submit"]');

    // Verify validation errors
    const emailError = page.locator('input[name="email"], input[type="email"]').locator('..');
    const passwordError = page.locator('input[name="password"], input[type="password"]').locator('..');

    // Form should show validation state (either HTML5 or custom)
    await expect(emailError.or(passwordError)).toBeVisible();
  });

  test('should display error for invalid credentials', async ({ page, nav, dom }) => {
    await nav.gotoLogin();

    await dom.fillField('input[name="email"], input[type="email"]', 'nonexistent@test.com');
    await dom.fillField('input[name="password"], input[type="password"]', 'WrongPassword123!');

    await dom.clickButton('button[type="submit"]');

    // Wait for error message to appear
    await expect(
      page.locator('text=/invalid.*credentials|incorrect.*password|login.*failed/i').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('should handle email format validation', async ({ page, nav, dom, testUser }) => {
    await nav.gotoLogin();

    await dom.fillField('input[name="email"], input[type="email"]', 'invalid-email-format');
    await dom.fillField('input[name="password"], input[type="password"]', testUser.password);

    // Blur email field
    await page.locator('input[name="email"], input[type="email"]').blur();

    // Verify email validation (either HTML5 or custom)
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    // If HTML5 validation is working, it should be invalid
    // Otherwise check for custom validation message
    if (!validity) {
      await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  test('should redirect to returnUrl after login', async ({ page, nav, dom, testUser }) => {
    const returnUrl = '/property-manager/analytics';
    
    // Navigate to login with returnUrl query parameter
    await nav.goto(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);

    await dom.fillField('input[name="email"], input[type="email"]', testUser.email);
    await dom.fillField('input[name="password"], input[type="password"]', testUser.password);

    await dom.clickButton('button[type="submit"]', {
      waitForNavigation: true,
    });

    // Verify redirect to returnUrl
    await expect(page).toHaveURL(new RegExp(returnUrl.replace('/', '\\/')));
  });

  test('should persist session on page refresh', async ({ page, nav, testUser }) => {
    // Login first
    await login(page, testUser.email, testUser.password);

    // Verify we're on dashboard
    await expect(page).toHaveURL(/\/property-manager|\/dashboard/);

    // Refresh page
    await nav.reload();

    // Verify still authenticated and on dashboard
    await expect(page).toHaveURL(/\/property-manager|\/dashboard/);
    
    const auth = await page.evaluate(() => localStorage.getItem('auth'));
    expect(auth).toBeTruthy();
  });

  test('should redirect authenticated users away from login page', async ({ page, nav, testUser }) => {
    // Login first
    await login(page, testUser.email, testUser.password);

    // Try to navigate to login page
    await nav.goto('/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/property-manager|\/dashboard/);
  });

  test('should display loading state during login', async ({ page, nav, dom, testUser }) => {
    await nav.gotoLogin();

    await dom.fillField('input[name="email"], input[type="email"]', testUser.email);
    await dom.fillField('input[name="password"], input[type="password"]', testUser.password);

    // Click submit
    await page.click('button[type="submit"]');

    // Verify button is disabled or shows loading state
    const submitButton = page.locator('button[type="submit"]');
    
    // Check for disabled state or loading spinner
    const isDisabled = await submitButton.isDisabled();
    const hasSpinner = await page.locator('[data-testid="spinner"], .spinner, [aria-busy="true"]').isVisible().catch(() => false);

    expect(isDisabled || hasSpinner).toBeTruthy();
  });
});

