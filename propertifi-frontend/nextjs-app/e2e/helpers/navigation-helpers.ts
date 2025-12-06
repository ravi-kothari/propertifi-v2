/**
 * Navigation Helpers for E2E Tests
 * 
 * Provides utilities for page navigation and route management
 */

import { Page } from '@playwright/test';

export class NavigationHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a page and wait for it to load
   */
  async goto(path: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    await this.page.goto(path, {
      waitUntil: options?.waitUntil || 'networkidle',
    });
  }

  /**
   * Navigate to login page
   */
  async gotoLogin(): Promise<void> {
    await this.goto('/login');
    await this.page.waitForSelector('input[name="email"], input[type="email"]');
  }

  /**
   * Navigate to registration page
   */
  async gotoRegister(): Promise<void> {
    await this.goto('/register');
    await this.page.waitForSelector('input[name="email"], input[type="email"]');
  }

  /**
   * Navigate to property manager dashboard
   */
  async gotoPMDashboard(): Promise<void> {
    await this.goto('/property-manager');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to owner dashboard
   */
  async gotoOwnerDashboard(): Promise<void> {
    await this.goto('/owner/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to templates page
   */
  async gotoTemplates(): Promise<void> {
    await this.goto('/templates');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to calculator page
   */
  async gotoCalculator(): Promise<void> {
    await this.goto('/calculators/roi');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify current URL matches expected path
   */
  async verifyURL(expectedPath: string): Promise<void> {
    const url = this.page.url();
    if (!url.includes(expectedPath)) {
      throw new Error(`Expected URL to contain "${expectedPath}", but got "${url}"`);
    }
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(expectedPath?: string): Promise<void> {
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
    
    if (expectedPath) {
      await this.verifyURL(expectedPath);
    }
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'networkidle' });
  }

  /**
   * Reload current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }
}









