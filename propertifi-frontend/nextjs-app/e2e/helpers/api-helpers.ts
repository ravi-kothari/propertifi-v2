/**
 * API Helpers for E2E Tests
 * 
 * Provides utilities to interact with the backend API during tests
 */

import { Page } from '@playwright/test';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class APIHelpers {
  constructor(private page: Page) {}

  /**
   * Make an authenticated API request
   */
  async apiRequest(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      token?: string;
    } = {}
  ): Promise<any> {
    const { method = 'GET', body, token } = options;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Try to get token from localStorage if not provided
    if (!token) {
      const storage = await this.page.evaluate(() => localStorage.getItem('auth'));
      if (storage) {
        try {
          const auth = JSON.parse(storage);
          if (auth.token) {
            headers['Authorization'] = `Bearer ${auth.token}`;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }

    const response = await this.page.evaluate(
      async ({ url, method, body, headers }) => {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        const data = await response.json().catch(() => ({}));
        return {
          status: response.status,
          ok: response.ok,
          data,
        };
      },
      {
        url: `${API_BASE_URL}${endpoint}`,
        method,
        body,
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} - ${JSON.stringify(response.data)}`);
    }

    return response.data;
  }

  /**
   * Wait for API request to complete
   */
  async waitForAPIRequest(urlPattern: string | RegExp, options: { timeout?: number } = {}): Promise<void> {
    await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: options.timeout || 10000 }
    );
  }

  /**
   * Intercept and mock API response
   */
  async mockAPIResponse(
    urlPattern: string | RegExp, 
    mockData: any, 
    status: number = 200
  ): Promise<void> {
    const pattern = typeof urlPattern === 'string' 
      ? `**${API_BASE_URL}${urlPattern}**`
      : urlPattern;
      
    await this.page.route(pattern, (route) => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(mockData),
      });
    });
  }

  /**
   * Get authentication token from localStorage
   */
  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => {
      try {
        const auth = localStorage.getItem('auth');
        if (auth) {
          const parsed = JSON.parse(auth);
          return parsed.token || null;
        }
      } catch (e) {
        // Ignore errors
      }
      return null;
    });
  }

  /**
   * Clear authentication from localStorage
   */
  async clearAuth(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('auth');
      localStorage.removeItem('user');
    });
  }

  /**
   * Verify user email by email address (test-only endpoint)
   * This uses a test-only backend endpoint that's only available in test/local environments
   */
  async verifyUserEmail(email: string): Promise<void> {
    try {
      await this.apiRequest('/v2/auth/test/verify-email', {
        method: 'POST',
        body: { email },
      });
    } catch (error: any) {
      // If the endpoint is not available (403), it means we're not in test environment
      // In that case, we'll try to use the standard verification flow
      if (error.message?.includes('403')) {
        console.warn(
          'Test verification endpoint not available. Please ensure APP_ENV is set to "testing" or "local"'
        );
        throw new Error(
          'Email verification failed: Test endpoint not available. Ensure you are running in test/local environment.'
        );
      }
      throw error;
    }
  }

  /**
   * Register a user and automatically verify their email (for tests)
   */
  async registerAndVerifyUser(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
  }): Promise<{ user: any; token: string }> {
    // Register the user
    const response = await this.apiRequest('/v2/auth/register', {
      method: 'POST',
      body: {
        ...userData,
        password_confirmation: userData.password_confirmation || userData.password,
      },
    });

    // Automatically verify the email (test-only)
    try {
      await this.verifyUserEmail(userData.email);
    } catch (error) {
      console.warn('Failed to auto-verify user email:', error);
      // Continue anyway - the registration was successful
    }

    return {
      user: response.user,
      token: response.access_token,
    };
  }
}

