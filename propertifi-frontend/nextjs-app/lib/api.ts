/**
 * Consolidated API Client for Propertifi
 * Combines axios with proper error handling, type safety, and React Query integration
 */

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
// Axios Client
// ============================================================================

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand persists it there)
    try {
      const authStorage = localStorage.getItem('propertifi-auth');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    // Handle 422 Validation Errors
    if (error.response?.status === 422 && error.response?.data?.errors) {
      throw new ValidationError(
        error.response.data.message || 'Validation failed',
        error.response.data.errors
      );
    }

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear auth state
      try {
        localStorage.removeItem('propertifi-auth');
        // Redirect to login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Error clearing auth:', e);
      }
    }

    // Handle other API errors
    throw new ApiClientError(
      error.response?.data?.message || error.message || 'An error occurred',
      error.response?.status,
      error.response?.data?.errors
    );
  }
);

// ============================================================================
// React Query Client
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Disable auto-refetch on window focus
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Helper to make typed GET requests
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * Helper to make typed POST requests
 */
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * Helper to make typed PUT requests
 */
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * Helper to make typed PATCH requests
 */
export async function patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * Helper to make typed DELETE requests
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

// ============================================================================
// Export for backwards compatibility
// ============================================================================

export default apiClient;
