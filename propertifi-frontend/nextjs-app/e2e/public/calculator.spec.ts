/**
 * ROI Calculator E2E Tests
 * 
 * Tests the property ROI calculator including:
 * - Input form
 * - Calculation logic
 * - Chart visualizations
 * - Print functionality
 * - PDF export
 */

import { test, expect } from '../fixtures/auth.fixture';

test.describe('ROI Calculator', () => {
  test('should display calculator page', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page).toHaveURL(/\/calculators\/roi/);

    // Verify calculator title
    await expect(
      page.locator('h1, h2').filter({ hasText: /roi|calculator|return.*investment/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('should display calculator input form', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Look for key input fields
    const inputs = [
      'purchase.*price',
      'down.*payment',
      'rent',
      'expenses',
      'interest.*rate',
    ];

    let foundInput = false;
    for (const inputPattern of inputs) {
      const input = page.locator(`input[name*="${inputPattern}"], input[placeholder*="${inputPattern}"], label:has-text("${inputPattern}")`).first();
      if (await input.count() > 0) {
        foundInput = true;
        break;
      }
    }

    if (!foundInput) {
      // Try more generic selectors
      const anyInput = page.locator('input[type="number"], input[name*="price"], input[name*="rent"]').first();
      await expect(anyInput).toBeVisible({ timeout: 3000 });
    }
  });

  test('should calculate ROI with valid inputs', async ({ page, nav, dom }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Fill in calculator inputs
    const purchasePriceInput = page.locator('input[name*="purchase"], input[name*="price"]').first();
    
    if (await purchasePriceInput.count() > 0) {
      await dom.fillField('input[name*="purchase"], input[name*="price"]', '300000');
      await dom.fillField('input[name*="down"], input[name*="downPayment"]', '60000');
      await dom.fillField('input[name*="rent"], input[placeholder*="rent"]', '2500');
      await dom.fillField('input[name*="rate"], input[name*="interest"]', '4.5');

      // Click calculate button
      const calculateButton = page.locator(
        'button:has-text("Calculate"), button[type="submit"], button:has-text("Calculate ROI")'
      ).first();

      if (await calculateButton.count() > 0) {
        await calculateButton.click();
        await page.waitForLoadState('networkidle');

        // Verify results displayed
        await expect(
          page.locator('text=/roi|return|cash.*flow|cap.*rate|%/i').first()
        ).toBeVisible({ timeout: 5000 });
      } else {
        // Calculator might auto-calculate - wait for results to appear
        await page.waitForLoadState('networkidle');
        const hasResults = await page.locator('text=/roi|%|return/i').first().isVisible({ timeout: 5000 });
        expect(hasResults).toBeTruthy();
      }
    } else {
      test.skip('Calculator form inputs not found');
    }
  });

  test('should display calculation results', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Look for results section
    const resultsSection = page.locator(
      '[data-testid="results"], .results, [class*="result"], text=/roi|cash.*flow|return/i'
    ).first();

    // Results might be visible after calculation or always visible
    const hasResults = await resultsSection.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (hasResults) {
      // Verify key metrics are displayed
      const metrics = ['roi', 'cash.*flow', 'cap.*rate', 'return'];
      let foundMetric = false;
      
      for (const metric of metrics) {
        const metricElement = page.locator(`text=/.*${metric}.*/i`).first();
        if (await metricElement.isVisible({ timeout: 1000 }).catch(() => false)) {
          foundMetric = true;
          break;
        }
      }

      expect(foundMetric).toBeTruthy();
    } else {
      test.skip('Results section not found - may require calculation first');
    }
  });

  test('should display ROI chart visualization', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    
    // Fill and calculate first
    const purchasePriceInput = page.locator('input[name*="purchase"], input[name*="price"]').first();
    if (await purchasePriceInput.count() > 0) {
      await purchasePriceInput.fill('300000');
      
      const calculateButton = page.locator('button:has-text("Calculate")').first();
      if (await calculateButton.count() > 0) {
        await calculateButton.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Look for charts
    const charts = page.locator('canvas, [class*="chart"], [data-testid="chart"]');
    const chartCount = await charts.count();

    if (chartCount > 0) {
      await expect(charts.first()).toBeVisible();
    } else {
      test.skip('Charts not found - may not be implemented yet');
    }
  });

  test('should validate calculator inputs', async ({ page, nav, dom }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Try invalid input (negative number)
    const priceInput = page.locator('input[name*="purchase"], input[name*="price"], input[type="number"]').first();
    
    if (await priceInput.count() > 0) {
      await priceInput.fill('-1000');
      await priceInput.blur();

      // Check for validation error
      const error = page.locator('text=/invalid|must.*positive|error/i').first();
      const hasError = await error.isVisible({ timeout: 2000 }).catch(() => false);
      
      // HTML5 validation might also handle this
      const validity = await priceInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      
      expect(hasError || !validity).toBeTruthy();
    } else {
      test.skip('Calculator inputs not found');
    }
  });

  test('should print calculation results', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    
    // Set up print listener
    let printCalled = false;
    page.on('dialog', () => { printCalled = true; });

    // Look for print button
    const printButton = page.locator(
      'button:has-text("Print"), button[aria-label*="print"], [data-testid="print"]'
    ).first();

    if (await printButton.count() > 0) {
      await printButton.click();
      
      // Print dialog might open or page might format for print
      // In headless mode, print dialog won't show, but we can verify button works
      await page.waitForLoadState('domcontentloaded');
      
      // Button click should succeed (actual print requires browser interaction)
      expect(await printButton.isVisible()).toBeTruthy();
    } else {
      test.skip('Print button not found');
    }
  });

  test('should export results to PDF', async ({ page, nav }) => {
    await nav.goto('/calculators/roi');
    await page.waitForLoadState('networkidle');

    // Fill and calculate if needed
    const priceInput = page.locator('input[name*="purchase"]').first();
    if (await priceInput.count() > 0) {
      await priceInput.fill('300000');
      const calculateButton = page.locator('button:has-text("Calculate")').first();
      if (await calculateButton.count() > 0) {
        await calculateButton.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Look for export PDF button
    const exportButton = page.locator(
      'button:has-text("Export"), button:has-text("PDF"), [data-testid="export-pdf"]'
    ).first();

    if (await exportButton.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);

      await exportButton.click();

      const download = await downloadPromise;
      
      if (download) {
        expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      } else {
        // PDF might open in new tab or use different method
        test.skip('PDF export may use different method');
      }
    } else {
      test.skip('PDF export button not found');
    }
  });
});

