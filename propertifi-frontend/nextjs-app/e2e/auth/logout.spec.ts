/**
 * User Logout E2E Tests
 * 
 * Tests the logout functionality and post-logout behavior
 */

import { test, expect, login, logout } from '../fixtures/auth.fixture';

test.describe('User Logout', () => {
  test('should successfully logout authenticated user', async ({ page, nav, testUser, api }) => {
    // Login first
    await login(page, testUser.email, testUser.password);

    // Verify logged in
    await expect(page).toHaveURL(/\/property-manager|\/dashboard/);

    // Click logout button
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]');
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
    } else {
      // Try to find user menu/dropdown
      const userMenu = page.locator('[data-testid="user-menu"], button[aria-label*="menu"]');
      if (await userMenu.count() > 0) {
        await userMenu.click();
        await page.locator('text=/logout|sign out/i').click();
      }
    }

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});

    // Verify redirect to login or homepage
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login|\/$/);

    // Verify auth cleared
    const auth = await page.evaluate(() => localStorage.getItem('auth'));
    expect(auth).toBeFalsy();
  });

  test('should clear authentication token on logout', async ({ page, testUser, api }) => {
    await login(page, testUser.email, testUser.password);

    // Verify token exists
    const tokenBefore = await api.getAuthToken();
    expect(tokenBefore).toBeTruthy();

    // Logout
    await logout(page);

    // Verify token cleared
    const tokenAfter = await api.getAuthToken();
    expect(tokenAfter).toBeFalsy();
  });

  test('should redirect to login after logout', async ({ page, nav, testUser }) => {
    await login(page, testUser.email, testUser.password);
    await logout(page);

    // Should be on login page or homepage
    const url = page.url();
    expect(url).toMatch(/\/login|\/$/);
  });

  test('should prevent access to protected routes after logout', async ({ page, nav, testUser }) => {
    await login(page, testUser.email, testUser.password);
    await logout(page);

    // Try to access protected route
    await nav.goto('/property-manager');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should call logout API endpoint', async ({ page, testUser, api }) => {
    await login(page, testUser.email, testUser.password);

    // Intercept logout API call
    let logoutCalled = false;
    page.on('request', (request) => {
      if (request.url().includes('/auth/logout')) {
        logoutCalled = true;
      }
    });

    await logout(page);

    // Verify API was called
    expect(logoutCalled).toBeTruthy();
  });
});









