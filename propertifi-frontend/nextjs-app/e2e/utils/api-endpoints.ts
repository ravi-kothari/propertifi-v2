/**
 * API Endpoint Constants
 * 
 * Centralized API endpoint definitions for E2E tests
 * to ensure consistency and maintainability
 */

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v2/auth/register',
    LOGIN: '/api/v2/auth/login',
    LOGOUT: '/api/v2/auth/logout',
    USER: '/api/v2/auth/user',
    FORGOT_PASSWORD: '/api/v2/auth/forgot-password',
    RESET_PASSWORD: '/api/v2/auth/reset-password',
    VERIFY_EMAIL: '/api/v2/auth/verify-email',
    RESEND_VERIFICATION: '/api/v2/auth/resend-verification',
    VERIFY_EMAIL_BY_EMAIL: '/api/v2/auth/test/verify-email', // Test-only endpoint
  },
  LEADS: {
    LIST: (pmId: string) => `/api/v2/property-managers/${pmId}/leads`,
    VIEW: (pmId: string, leadId: string) => 
      `/api/v2/property-managers/${pmId}/leads/${leadId}/view`,
    DETAILS: (leadId: string) => `/api/v2/leads/${leadId}`,
    MATCHES: (leadId: string) => `/api/v2/leads/${leadId}/matches`,
    DISTRIBUTE: (leadId: string) => `/api/v2/leads/${leadId}/distribute`,
    DISTRIBUTION_STATS: (leadId: string) => `/api/v2/leads/${leadId}/distribution-stats`,
  },
  RESPONSES: {
    SUBMIT: (leadId: string) => `/api/v2/leads/${leadId}/responses`,
    GET: (leadId: string) => `/api/v2/leads/${leadId}/responses`,
  },
  ANALYTICS: {
    DASHBOARD: '/api/v2/analytics/dashboard',
    FUNNEL: '/api/v2/analytics/funnel',
    PM_PERFORMANCE: (pmId: string) => `/api/v2/analytics/pm/${pmId}`,
    TIME_SERIES: '/api/v2/analytics/time-series',
  },
  TEMPLATES: {
    LIST: '/api/v2/templates',
    GET: (id: string) => `/api/v2/templates/${id}`,
    DOWNLOAD: (id: string) => `/api/v2/templates/${id}/download`,
    CATEGORIES: '/api/v2/templates/categories',
  },
  LEGAL: {
    STATES: '/api/v2/legal/states',
    TOPICS: '/api/v2/legal/topics',
    STATE_LAWS: (state: string) => `/api/v2/legal/states/${state}/laws`,
    STATE_LAW_BY_TOPIC: (state: string, topic: string) => 
      `/api/v2/legal/states/${state}/laws/${topic}`,
    SEARCH: '/api/v2/legal/search',
  },
} as const;

