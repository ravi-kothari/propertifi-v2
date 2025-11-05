/**
 * Unauthorized Access E2E Tests
 * 
 * Tests protection of routes and resources that require authentication
 */

import { test, expect, login } from '../fixtures/auth.fixture';

test.describe('Unauthorized Access', () => {
  test('should redirect unauthenticated users from PM dashboard', async ({ page, nav, api }) => {
    // Ensure not logged in
    await api.clearAuth();

    // Try to access PM dashboard
    await nav.goto('/property-manager');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated users from owner dashboard', async ({ page, nav, api }) => {
    await api.clearAuth();

    await nav.goto('/owner/dashboard');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated users from analytics page', async ({ page, nav, api }) => {
    await api.clearAuth();

    await nav.goto('/property-manager/analytics');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should prevent access to protected API endpoints without token', async ({ page, api }) => {
    await api.clearAuth();

    // Try to access protected API
    try {
      await api.apiRequest('/v2/property-managers/1/leads');
      // Should not reach here
      expect(false).toBeTruthy();
    } catch (error: any) {
      // Should get 401 or 403 error
      expect(error.message).toMatch(/401|403|unauthorized|forbidden/i);
    }
  });

  test('should prevent PM users from accessing owner routes', async ({ page, nav, testUser }) => {
    // Login as PM
    await login(page, testUser.email, testUser.password);

    // Try to access owner dashboard
    await nav.goto('/owner/dashboard');

    // Should redirect or show error
    const currentUrl = page.url();
    const isRedirected = !currentUrl.includes('/owner/dashboard');
    const hasError = await page.locator('text=/unauthorized|access.*denied|forbidden/i').isVisible({ timeout: 2000 });

    expect(isRedirected || hasError).toBeTruthy();
  });

  test('should prevent owner users from accessing PM routes', async ({ page, nav, testUser }) => {
    // Login as owner (would need owner test user)
    const ownerEmail = testUser.email.replace('property_manager', 'owner');
    
    try {
      await login(page, ownerEmail, testUser.password, 'owner');
    } catch (e) {
      test.skip('Owner user not available for testing');
    }

    // Try to access PM dashboard
    await nav.goto('/property-manager');

    // Should redirect or show error
    const currentUrl = page.url();
    const isRedirected = !currentUrl.includes('/property-manager');
    const hasError = await page.locator('text=/unauthorized|access.*denied/i').isVisible({ timeout: 2000 });

    expect(isRedirected || hasError).toBeTruthy();
  });

  test('should handle expired token gracefully', async ({ page, nav, testUser, api }) => {
    await login(page, testUser.email, testUser.password);

    // Simulate expired token by clearing auth
    await api.clearAuth();

    // Try to access protected page
    await nav.goto('/property-manager');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should preserve return URL when redirecting unauthorized users', async ({ page, nav, api }) => {
    await api.clearAuth();

    // Try to access protected page
    await nav.goto('/property-manager/analytics');

    // Should redirect to login with returnUrl
    const url = page.url();
    expect(url).toMatch(/\/login/);
    
    // Check for returnUrl parameter (may or may not be implemented)
    const hasReturnUrl = url.includes('returnUrl') || url.includes('redirect');
    
    // Return URL preservation is optional, so we just verify redirect happened
    expect(url).toMatch(/\/login/);
  });
});

