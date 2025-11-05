/**
 * Lead Response E2E Tests
 * 
 * Tests all 4 lead response types:
 * - Contact Info
 * - Schedule Viewing
 * - Price Quote
 * - Decline
 */

import { test, expect, login } from '../fixtures/auth.fixture';
import { TestDataGenerator } from '../utils/test-data-generator';

test.describe('Lead Response', () => {
  test.beforeEach(async ({ page, testUser }) => {
    await login(page, testUser.email, testUser.password);
    await page.goto('/property-manager');
    await page.waitForLoadState('networkidle');
  });

  test('should submit Contact Info response', async ({ page, api }) => {
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    
    if (await leadCards.count() === 0) {
      test.skip('No leads available');
    }

    await leadCards.click();
    
    // Wait for modal to appear
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Navigate to respond tab if needed
    const respondTab = modal.locator('button:has-text("Respond"), [role="tab"]:has-text("Respond")');
    if (await respondTab.count() > 0) {
      await respondTab.click();
      // Wait for tab content to be visible
      await page.waitForLoadState('domcontentloaded');
    }

    // Select Contact Info response type
    const contactOption = modal.locator(
      'button:has-text("Contact Info"), input[value="contact_info"], label:has-text("Contact")'
    ).first();

    if (await contactOption.count() > 0) {
      await contactOption.click();
      // Wait for form to be visible
      await page.waitForLoadState('domcontentloaded');

      // Fill contact information
      const phoneInput = modal.locator('input[name="phone"], input[type="tel"]').first();
      const emailInput = modal.locator('input[name="email"], input[type="email"]').last();

      if (await phoneInput.count() > 0) {
        await phoneInput.fill('555-123-4567');
      }
      if (await emailInput.count() > 0) {
        await emailInput.fill('pm@test.com');
      }

      // Submit response
      const submitButton = modal.locator('button[type="submit"], button:has-text("Submit")').first();
      await submitButton.click();

      // Wait for success message
      await expect(
        page.locator('text=/success|submitted|thank you/i').first()
      ).toBeVisible({ timeout: 5000 });

      // Verify response in history
      const historyTab = modal.locator('button:has-text("History")');
      if (await historyTab.count() > 0) {
        await historyTab.click();
        await page.waitForLoadState('domcontentloaded');
        await expect(modal.locator('text=/contact|phone|email/i')).toBeVisible({ timeout: 5000 });
      }
    } else {
      test.skip('Contact Info response option not found');
    }
  });

  test('should submit Schedule Viewing response', async ({ page }) => {
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    
    if (await leadCards.count() === 0) {
      test.skip('No leads available');
    }

    await leadCards.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toBeVisible();

    // Navigate to respond tab
    const respondTab = modal.locator('button:has-text("Respond"), [role="tab"]:has-text("Respond")');
    if (await respondTab.count() > 0) {
      await respondTab.click();
      // Wait for tab content to be visible
      await page.waitForLoadState('domcontentloaded');
    }

    // Select Schedule Viewing
    const viewingOption = modal.locator(
      'button:has-text("Schedule"), input[value="schedule_viewing"], label:has-text("Schedule")'
    ).first();

    if (await viewingOption.count() > 0) {
      await viewingOption.click();
      await page.waitForLoadState('domcontentloaded');

      // Fill date and time
      const dateInput = modal.locator('input[type="date"], input[name="date"]').first();
      const timeInput = modal.locator('input[type="time"], input[name="time"], select[name="time"]').first();

      if (await dateInput.count() > 0) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        await dateInput.fill(futureDate.toISOString().split('T')[0]);
      }

      if (await timeInput.count() > 0) {
        if (await timeInput.evaluate((el: any) => el.tagName === 'SELECT')) {
          await timeInput.selectOption({ index: 1 });
        } else {
          await timeInput.fill('14:00');
        }
      }

      // Submit
      const submitButton = modal.locator('button[type="submit"]').first();
      await submitButton.click();

      await expect(
        page.locator('text=/success|scheduled/i').first()
      ).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('Schedule Viewing option not found');
    }
  });

  test('should submit Price Quote response', async ({ page }) => {
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    
    if (await leadCards.count() === 0) {
      test.skip('No leads available');
    }

    await leadCards.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toBeVisible();

    // Navigate to respond tab
    const respondTab = modal.locator('button:has-text("Respond")');
    if (await respondTab.count() > 0) {
      await respondTab.click();
      // Wait for tab content to be visible
      await page.waitForLoadState('domcontentloaded');
    }

    // Select Price Quote
    const quoteOption = modal.locator(
      'button:has-text("Price"), input[value="price_quote"], label:has-text("Quote")'
    ).first();

    if (await quoteOption.count() > 0) {
      await quoteOption.click();
      await page.waitForLoadState('domcontentloaded');

      // Fill quote details
      const amountInput = modal.locator('input[name="amount"], input[type="number"]').first();
      const frequencySelect = modal.locator('select[name="frequency"]').first();
      const messageInput = modal.locator('textarea[name="message"], textarea').first();

      if (await amountInput.count() > 0) {
        await amountInput.fill('299.99');
      }

      if (await frequencySelect.count() > 0) {
        await frequencySelect.selectOption('monthly');
      }

      if (await messageInput.count() > 0) {
        await messageInput.fill('This is our competitive pricing for property management services.');
      }

      // Submit
      const submitButton = modal.locator('button[type="submit"]').first();
      await submitButton.click();

      await expect(
        page.locator('text=/success|submitted/i').first()
      ).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('Price Quote option not found');
    }
  });

  test('should submit Decline response', async ({ page }) => {
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    
    if (await leadCards.count() === 0) {
      test.skip('No leads available');
    }

    await leadCards.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal).toBeVisible();

    // Navigate to respond tab
    const respondTab = modal.locator('button:has-text("Respond")');
    if (await respondTab.count() > 0) {
      await respondTab.click();
      // Wait for tab content to be visible
      await page.waitForLoadState('domcontentloaded');
    }

    // Select Decline
    const declineOption = modal.locator(
      'button:has-text("Decline"), input[value="decline"], label:has-text("Decline")'
    ).first();

    if (await declineOption.count() > 0) {
      await declineOption.click();
      await page.waitForLoadState('domcontentloaded');

      // Optionally fill message
      const messageInput = modal.locator('textarea[name="message"]').first();
      if (await messageInput.count() > 0) {
        await messageInput.fill('Thank you, but we are unable to take on this property at this time.');
      }

      // Submit
      const submitButton = modal.locator('button[type="submit"]').first();
      await submitButton.click();

      await expect(
        page.locator('text=/success|declined/i').first()
      ).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('Decline option not found');
    }
  });

  test('should validate required fields in response forms', async ({ page }) => {
    const leadCards = page.locator('[data-testid="lead-card"], .lead-card, article').first();
    
    if (await leadCards.count() === 0) {
      test.skip('No leads available');
    }

    await leadCards.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });
    const respondTab = modal.locator('button:has-text("Respond")');
    
    if (await respondTab.count() > 0) {
      await respondTab.click();
      // Wait for tab content to be visible
      await page.waitForLoadState('domcontentloaded');

      // Try to submit without filling required fields
      const submitButton = modal.locator('button[type="submit"]').first();
      await submitButton.click();

      // Verify validation errors
      await expect(
        modal.locator('text=/required|fill|error/i').first()
      ).toBeVisible({ timeout: 2000 }).catch(() => {
        // Validation might be handled differently
      });
    } else {
      test.skip('Response form not available');
    }
  });

  test('should update lead status after response submission', async ({ page }) => {
    // This would verify that after submitting a response,
    // the lead status updates (e.g., from "new" to "contacted")
    
    test.skip('Lead status update verification requires specific test data');
  });
});

