/**
 * Authentication Fixtures for E2E Tests
 * 
 * Provides reusable authentication helpers and fixtures
 */

import { test as base, expect } from '@playwright/test';
import { APIHelpers } from '../helpers/api-helpers';
import { DOMHelpers } from '../helpers/dom-helpers';
import { NavigationHelpers } from '../helpers/navigation-helpers';
import { TestDataGenerator } from '../utils/test-data-generator';

type AuthFixtures = {
  api: APIHelpers;
  dom: DOMHelpers;
  nav: NavigationHelpers;
  testUser: ReturnType<typeof TestDataGenerator.generateUser>;
  authenticatedPage: void;
};

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  // API helpers
  api: async ({ page }, use) => {
    await use(new APIHelpers(page));
  },

  // DOM helpers
  dom: async ({ page }, use) => {
    await use(new DOMHelpers(page));
  },

  // Navigation helpers
  nav: async ({ page }, use) => {
    await use(new NavigationHelpers(page));
  },

  // Generate test user
  testUser: async ({}, use) => {
    const user = TestDataGenerator.generateUser('property_manager');
    await use(user);
  },

  // Authenticated page (logs in before test)
  authenticatedPage: async ({ page, nav, api, testUser }, use) => {
    // Ensure user email is verified before login (test-only)
    try {
      await api.verifyUserEmail(testUser.email);
    } catch (error) {
      console.warn('Failed to verify user email, continuing with login attempt:', error);
    }

    // Use the login helper
    await login(page, testUser.email, testUser.password, testUser.role || 'property_manager');

    // Verify we're logged in (check for dashboard or user menu)
    await expect(page).toHaveURL(/\/property-manager|\/owner\/dashboard|\/dashboard/);

    await use();

    // Cleanup: logout after test
    await api.clearAuth();
  },
});

export { expect };

/**
 * Helper function to login programmatically
 * Automatically verifies user email if login fails due to unverified email
 */
export async function login(
  page: any,
  email: string,
  password: string,
  role: 'property_manager' | 'owner' = 'property_manager'
): Promise<void> {
  const nav = new NavigationHelpers(page);
  const api = new APIHelpers(page);

  // Try direct API login first
  try {
    const response = await api.apiRequest('/v2/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (response.access_token || response.token) {
      // Store token in localStorage
      const token = response.access_token || response.token;
      await page.evaluate(
        (token) => {
          localStorage.setItem('auth', JSON.stringify({ token }));
        },
        token
      );

      // Navigate to appropriate dashboard
      const dashboardPath = role === 'property_manager' ? '/property-manager' : '/owner/dashboard';
      await nav.goto(dashboardPath);
      return;
    }
  } catch (e: any) {
    // Check if login failed due to unverified email
    const errorMessage = e.message || JSON.stringify(e);
    if (errorMessage.includes('verify your email') || errorMessage.includes('403')) {
      // Attempt to verify email (test-only)
      try {
        await api.verifyUserEmail(email);
        // Retry login after verification
        const response = await api.apiRequest('/v2/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        if (response.access_token || response.token) {
          const token = response.access_token || response.token;
          await page.evaluate(
            (token) => {
              localStorage.setItem('auth', JSON.stringify({ token }));
            },
            token
          );
          const dashboardPath = role === 'property_manager' ? '/property-manager' : '/owner/dashboard';
          await nav.goto(dashboardPath);
          return;
        }
      } catch (verifyError) {
        console.warn('Failed to verify email during login:', verifyError);
      }
    }
    // Fall back to UI login
  }

  // UI-based login fallback
  await nav.gotoLogin();
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"], button:has-text("Log in")'),
  ]);
}

/**
 * Helper function to logout
 */
export async function logout(page: any): Promise<void> {
  const api = new APIHelpers(page);

  // Try API logout
  try {
    const token = await api.getAuthToken();
    if (token) {
      await api.apiRequest('/v2/auth/logout', {
        method: 'POST',
        token,
      });
    }
  } catch (e) {
    // Continue with UI logout
  }

  // Clear local storage
  await api.clearAuth();

  // Try clicking logout button if present
  try {
    await page.click('button:has-text("Logout"), a:has-text("Logout")');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
  } catch (e) {
    // Logout button not found or already logged out
  }
}

