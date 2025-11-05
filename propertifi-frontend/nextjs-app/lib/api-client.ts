/**
 * API Client for Propertifi Backend
 * Centralized API communication layer with error handling and type safety
 */

import type {
  LeadSubmissionRequest,
  LeadSubmissionResponse,
  PropertyManagerListResponse,
  PropertyManagerDetailResponse,
  StatesResponse,
  CitiesResponse,
  TestimonialsResponse,
  BlogListResponse,
  BlogDetailResponse,
  ApiError,
  ApiResponse,
} from './types/api';

// ============================================================================
// Configuration
// ============================================================================

const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = envApiUrl ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`) : 'http://localhost:8000/api';
const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:8000';

// ============================================================================
// Error Classes
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 422, errors);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> | ApiError = await response.json();

    // Handle HTTP error status codes
    if (!response.ok) {
      if (response.status === 422 && 'errors' in data) {
        // Validation error
        throw new ValidationError(
          data.message || 'Validation failed',
          data.errors || {}
        );
      }

      // Other API errors
      throw new ApiClientError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        'errors' in data ? data.errors : undefined
      );
    }

    // Handle API-level errors (success: false)
    if ('success' in data && !data.success) {
      throw new ApiClientError(
        data.message || 'API request failed',
        response.status,
        'errors' in data ? data.errors : undefined
      );
    }

    return data as T;
  } catch (error) {
    // Network errors or JSON parsing errors
    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      undefined,
      undefined
    );
  }
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  // Ensure endpoint starts with / for proper URL construction
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Construct full URL by appending endpoint to base URL
  const fullUrl = `${API_BASE_URL}${normalizedEndpoint}`;
  const url = new URL(fullUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Lead Submission
 */
export async function submitLead(
  data: LeadSubmissionRequest
): Promise<LeadSubmissionResponse> {
  const url = buildUrl('home-page-lead'); // Laravel endpoint

  return fetchWithErrorHandling<LeadSubmissionResponse>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get Property Managers by Location
 */
export async function getPropertyManagers(params?: {
  state?: string;
  city?: string;
  search?: string;
  property_types?: string[];
  min_rating?: number;
  min_experience?: number;
  services?: string[];
  sort?: string;
  page?: number;
  per_page?: number;
}): Promise<PropertyManagerListResponse> {
  const queryParams: Record<string, string | number> = {};

  if (params) {
    if (params.state) queryParams.state = params.state;
    if (params.city) queryParams.city = params.city;
    if (params.search) queryParams.search = params.search;
    if (params.min_rating) queryParams.min_rating = params.min_rating;
    if (params.min_experience) queryParams.min_experience = params.min_experience;
    if (params.sort) queryParams.sort = params.sort;
    if (params.page) queryParams.page = params.page;
    if (params.per_page) queryParams.per_page = params.per_page;

    // Handle array parameters
    if (params.property_types) {
      params.property_types.forEach((type, index) => {
        queryParams[`property_types[${index}]`] = type;
      });
    }
    if (params.services) {
      params.services.forEach((service, index) => {
        queryParams[`services[${index}]`] = service;
      });
    }
  }

  const url = buildUrl('property-managers', queryParams);

  return fetchWithErrorHandling<PropertyManagerListResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Property Manager Details
 */
export async function getPropertyManagerDetails(
  state: string,
  city: string,
  slug: string
): Promise<PropertyManagerDetailResponse> {
  const url = buildUrl(`/property-managers/${state}/${city}/${slug}`);

  return fetchWithErrorHandling<PropertyManagerDetailResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get States List
 */
export async function getStates(): Promise<StatesResponse> {
  const url = buildUrl('states');

  return fetchWithErrorHandling<StatesResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Cities by State
 */
export async function getCitiesByState(stateCode: string): Promise<CitiesResponse> {
  const url = buildUrl(`/states/${stateCode}/cities`);

  return fetchWithErrorHandling<CitiesResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Published Testimonials
 */
export async function getTestimonials(limit?: number): Promise<TestimonialsResponse> {
  const params: Record<string, number> | undefined = limit ? { limit } : undefined;
  const url = buildUrl('testimonials/published', params);

  return fetchWithErrorHandling<TestimonialsResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Latest Blog Posts
 */
export async function getLatestBlogPosts(limit?: number): Promise<BlogListResponse> {
  const params: Record<string, number> | undefined = limit ? { limit } : undefined;
  const url = buildUrl('blogs/latest', params);

  return fetchWithErrorHandling<BlogListResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Blog Posts by Category
 */
export async function getBlogsByCategory(
  category: string,
  page?: number
): Promise<BlogListResponse> {
  const params: Record<string, string | number> = { category };
  if (page) params.page = page;

  const url = buildUrl('blogs', params);

  return fetchWithErrorHandling<BlogListResponse>(url, {
    method: 'GET',
  });
}

/**
 * Get Blog Post Details
 */
export async function getBlogPost(slug: string): Promise<BlogDetailResponse> {
  const url = buildUrl(`/blogs/${slug}`);

  return fetchWithErrorHandling<BlogDetailResponse>(url, {
    method: 'GET',
  });
}

/**
 * Search Blogs
 */
export async function searchBlogs(
  query: string,
  page?: number
): Promise<BlogListResponse> {
  const params: Record<string, string | number> = { search: query };
  if (page) params.page = page;

  const url = buildUrl('blogs/search', params);

  return fetchWithErrorHandling<BlogListResponse>(url, {
    method: 'GET',
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get full URL for main app routes (Laravel)
 */
export function getMainAppUrl(path: string): string {
  return `${MAIN_APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Transform form data to API format
 */
export function transformFormDataToApiFormat(formData: {
  propertyType: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfUnits?: number;
  squareFootage?: number;
  additionalServices: string[];
  fullName: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone';
}): LeadSubmissionRequest {
  return {
    property_type: formData.propertyType,
    street_address: formData.streetAddress,
    city: formData.city,
    state: formData.state,
    zip_code: formData.zipCode,
    number_of_units: formData.numberOfUnits,
    square_footage: formData.squareFootage,
    additional_services: formData.additionalServices,
    full_name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    preferred_contact: formData.preferredContact,
    source: 'get-started-form',
  };
}

// ============================================================================
// Export Configuration
// ============================================================================

export const apiConfig = {
  baseUrl: API_BASE_URL,
  mainAppUrl: MAIN_APP_URL,
} as const;
