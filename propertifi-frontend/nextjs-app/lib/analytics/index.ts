/**
 * Analytics tracking utilities for Google Analytics 4
 * 
 * Usage:
 * import { trackEvent } from '@/lib/analytics';
 * trackEvent('calculator_used', { calculator_type: 'roi' });
 */

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, eventParams);
  }
}

/**
 * Track page views
 */
export function trackPageView(url: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
}

// Calculator-specific tracking events

/**
 * Track when a calculator is loaded
 */
export function trackCalculatorView(calculatorType: string): void {
  trackEvent('calculator_view', {
    calculator_type: calculatorType,
  });
}

/**
 * Track when a calculator is used/calculated
 */
export function trackCalculatorUsed(
  calculatorType: string,
  additionalData?: Record<string, any>
): void {
  trackEvent('calculator_used', {
    calculator_type: calculatorType,
    ...additionalData,
  });
}

/**
 * Track PDF exports
 */
export function trackPDFExport(calculatorType: string): void {
  trackEvent('pdf_export', {
    calculator_type: calculatorType,
    export_format: 'pdf',
  });
}

/**
 * Track save attempts
 */
export function trackSaveAttempt(
  calculatorType: string,
  isAuthenticated: boolean
): void {
  trackEvent('save_calculation_attempt', {
    calculator_type: calculatorType,
    is_authenticated: isAuthenticated,
  });
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(
  ctaType: string,
  location: string,
  calculatorType?: string
): void {
  trackEvent('cta_click', {
    cta_type: ctaType,
    location: location,
    calculator_type: calculatorType,
  });
}

/**
 * Track calculation completion
 */
export function trackCalculationComplete(
  calculatorType: string,
  resultMetrics?: Record<string, number>
): void {
  trackEvent('calculation_complete', {
    calculator_type: calculatorType,
    ...resultMetrics,
  });
}

/**
 * Track user engagement time on calculator
 */
export function trackCalculatorEngagement(
  calculatorType: string,
  timeSpentSeconds: number
): void {
  trackEvent('calculator_engagement', {
    calculator_type: calculatorType,
    engagement_time_seconds: timeSpentSeconds,
  });
}

/**
 * Track input field interactions
 */
export function trackInputInteraction(
  calculatorType: string,
  fieldName: string,
  fieldValue?: any
): void {
  // Only track in production to avoid noise
  if (process.env.NODE_ENV === 'production') {
    trackEvent('input_interaction', {
      calculator_type: calculatorType,
      field_name: fieldName,
      // Don't track actual values for privacy
    });
  }
}

/**
 * Track calculation errors
 */
export function trackCalculationError(
  calculatorType: string,
  errorType: string,
  errorMessage?: string
): void {
  trackEvent('calculation_error', {
    calculator_type: calculatorType,
    error_type: errorType,
    error_message: errorMessage,
  });
}
