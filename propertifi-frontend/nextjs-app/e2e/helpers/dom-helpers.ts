/**
 * DOM Helpers for E2E Tests
 * 
 * Provides utilities for common DOM interactions and assertions
 */

import { Page, Locator } from '@playwright/test';

export class DOMHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for element to be visible and enabled
   */
  async waitForElement(selector: string, options?: { timeout?: number }): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
    return locator;
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector: string, value: string): Promise<void> {
    const field = await this.waitForElement(selector);
    await field.clear();
    await field.fill(value);
    await field.blur(); // Trigger validation
  }

  /**
   * Click button and wait for navigation or action
   */
  async clickButton(selector: string, options?: { waitForNavigation?: boolean }): Promise<void> {
    const button = await this.waitForElement(selector);
    
    if (options?.waitForNavigation) {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        button.click(),
      ]);
    } else {
      await button.click();
    }
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    const select = await this.waitForElement(selector);
    await select.selectOption(value);
  }

  /**
   * Check checkbox or radio button
   */
  async check(selector: string, checked: boolean = true): Promise<void> {
    const checkbox = await this.waitForElement(selector);
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  /**
   * Wait for toast/notification message
   */
  async waitForToast(message?: string, timeout: number = 5000): Promise<Locator> {
    const toastSelector = '[role="alert"], .toast, [data-testid="toast"]';
    const toast = this.page.locator(toastSelector);
    
    if (message) {
      await toast.filter({ hasText: message }).waitFor({ timeout });
    } else {
      await toast.first().waitFor({ timeout });
    }
    
    return toast;
  }

  /**
   * Verify element contains text
   */
  async verifyText(selector: string, expectedText: string): Promise<void> {
    const element = await this.waitForElement(selector);
    const text = await element.textContent();
    if (!text?.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}" not found in element. Found: "${text}"`);
    }
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingComplete(selector: string = '[data-testid="loading"], .spinner'): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout: 10000 });
    } catch (e) {
      // Loading might already be complete or not present
    }
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}









