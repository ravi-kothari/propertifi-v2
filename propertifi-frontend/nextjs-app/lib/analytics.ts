/**
 * Analytics Service
 * 
 * This file provides a centralized place for all analytics tracking events.
 * It can be configured to send data to any analytics provider (GA, PostHog, etc.).
 */

declare global {
    interface Window {
        gtag?: (command: string, target: string, params?: Record<string, any>) => void;
        posthog?: {
            capture: (eventName: string, properties?: Record<string, any>) => void;
        };
    }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * Tracks a page view event.
 * In a real app, this would be called in a top-level component on route change.
 * @param url - The URL of the page viewed.
 */
export const trackPageView = (url: string) => {
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
  if (POSTHOG_KEY && window.posthog) {
    window.posthog.capture('$pageview');
  }
  console.log(`[Analytics] Page View: ${url}`);
};

/**
 * Tracks a generic event.
 * @param eventName - The name of the event (e.g., 'get_started_click').
 * @param properties - Optional properties associated with the event.
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (GA_TRACKING_ID && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  if (POSTHOG_KEY && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
  console.log(`[Analytics] Event: ${eventName}`, properties || '');
};

/**
 * Specific event tracking functions
 */

export const analytics = {
  trackGetStartedClick: () => {
    trackEvent('get_started_click', { category: 'engagement', label: 'Hero Button' });
  },
  trackFormStepCompletion: (step: number, stepName: string) => {
    trackEvent('form_step_completion', { step, step_name: stepName });
  },
  trackFormSubmission: (formName: string) => {
    trackEvent('form_submission', { form_name: formName });
  },
  trackSearchQuery: (query: string) => {
    trackEvent('search', { search_term: query });
  },
};
