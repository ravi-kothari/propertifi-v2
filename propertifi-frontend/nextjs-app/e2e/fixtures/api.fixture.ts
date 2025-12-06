/**
 * API Fixtures for E2E Tests
 * 
 * Provides reusable API interaction helpers
 */

import { Page } from '@playwright/test';
import { APIHelpers } from '../helpers/api-helpers';

export class APIFixtures {
  private api: APIHelpers;

  constructor(private page: Page) {
    this.api = new APIHelpers(page);
  }

  /**
   * Get API helper instance
   */
  getAPI(): APIHelpers {
    return this.api;
  }

  /**
   * Wait for specific API endpoint to be called
   */
  async waitForEndpoint(endpoint: string, timeout: number = 10000): Promise<void> {
    await this.api.waitForAPIRequest(endpoint, { timeout });
  }

  /**
   * Mock API response for testing
   */
  async mockEndpoint(endpoint: string | RegExp, response: any): Promise<void> {
    await this.api.mockAPIResponse(endpoint, response);
  }
}









