/**
 * Owner API Functions
 * API client for owner-specific endpoints
 */

import { apiClient } from './api';
import {
  OwnerDashboardData,
  Lead,
  LeadsResponse,
  LeadDetailData,
  Bookmark,
  BookmarksResponse,
  SavedCalculation,
  CalculationsResponse,
  LeadFilters,
  LeadSort,
  CalculatorType,
} from '@/types/owner';

const OWNER_BASE_PATH = '/api/owner';

// ============================================================================
// Dashboard
// ============================================================================

export const getDashboardData = async (): Promise<OwnerDashboardData> => {
  const response = await apiClient.get<{ success: boolean; data: OwnerDashboardData }>(`${OWNER_BASE_PATH}/dashboard`);
  return response.data.data;
};

// ============================================================================
// Leads
// ============================================================================

export interface GetLeadsParams {
  page?: number;
  per_page?: number;
  filters?: LeadFilters;
  sort?: LeadSort;
}

export const getLeads = async (params?: GetLeadsParams): Promise<LeadsResponse> => {
  const response = await apiClient.get<{ success: boolean; data: any[]; meta: any }>(`${OWNER_BASE_PATH}/leads`, {
    params: {
      page: params?.page || 1,
      per_page: params?.per_page || 10,
      ...params?.filters,
      sort_by: params?.sort?.field,
      sort_direction: params?.sort?.direction,
    },
  });
  // Transform backend response to match expected LeadsResponse format
  return {
    data: response.data.data || [],
    total: response.data.meta?.total || 0,
    per_page: response.data.meta?.per_page || 10,
    current_page: response.data.meta?.current_page || 1,
    last_page: response.data.meta?.last_page || 1,
  };
};

export const getLead = async (id: number): Promise<LeadDetailData> => {
  const response = await apiClient.get<{ data: LeadDetailData }>(`${OWNER_BASE_PATH}/leads/${id}`);
  return response.data.data;
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const response = await apiClient.post<Lead>(`${OWNER_BASE_PATH}/leads`, data);
  return response.data;
};

export const updateLead = async (id: number, data: Partial<Lead>): Promise<Lead> => {
  const response = await apiClient.put<Lead>(`${OWNER_BASE_PATH}/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id: number): Promise<void> => {
  await apiClient.delete(`${OWNER_BASE_PATH}/leads/${id}`);
};

// ============================================================================
// Bookmarks (Saved Property Managers)
// ============================================================================

export const getBookmarks = async (): Promise<BookmarksResponse> => {
  const response = await apiClient.get<BookmarksResponse>(`${OWNER_BASE_PATH}/bookmarks`);
  return response.data;
};

export const addBookmark = async (propertyManagerId: number, notes?: string): Promise<Bookmark> => {
  const response = await apiClient.post<Bookmark>(`${OWNER_BASE_PATH}/bookmarks`, {
    property_manager_id: propertyManagerId,
    notes,
  });
  return response.data;
};

export const removeBookmark = async (id: number): Promise<void> => {
  await apiClient.delete(`${OWNER_BASE_PATH}/bookmarks/${id}`);
};

export const updateBookmark = async (id: number, notes: string): Promise<Bookmark> => {
  const response = await apiClient.put<Bookmark>(`${OWNER_BASE_PATH}/bookmarks/${id}`, { notes });
  return response.data;
};

// ============================================================================
// Saved Calculations
// ============================================================================

export const getCalculations = async (): Promise<CalculationsResponse> => {
  const response = await apiClient.get<CalculationsResponse>(`${OWNER_BASE_PATH}/calculations`);
  return response.data;
};

export const getCalculation = async (id: number): Promise<SavedCalculation> => {
  const response = await apiClient.get<SavedCalculation>(`${OWNER_BASE_PATH}/calculations/${id}`);
  return response.data;
};

export interface SaveCalculationData {
  calculator_type: CalculatorType;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
}

export const saveCalculation = async (data: SaveCalculationData): Promise<SavedCalculation> => {
  const response = await apiClient.post<SavedCalculation>(`${OWNER_BASE_PATH}/calculations`, data);
  return response.data;
};

export const updateCalculation = async (
  id: number,
  data: Partial<SaveCalculationData>
): Promise<SavedCalculation> => {
  const response = await apiClient.put<SavedCalculation>(
    `${OWNER_BASE_PATH}/calculations/${id}`,
    data
  );
  return response.data;
};

export const deleteCalculation = async (id: number): Promise<void> => {
  await apiClient.delete(`${OWNER_BASE_PATH}/calculations/${id}`);
};

// ============================================================================
// Profile
// ============================================================================

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<any> => {
  const response = await apiClient.put(`${OWNER_BASE_PATH}/profile`, data);
  return response.data;
};

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await apiClient.post(`${OWNER_BASE_PATH}/change-password`, data);
};

export interface NotificationPreferences {
  email_new_matches: boolean;
  email_messages: boolean;
  email_weekly_summary: boolean;
  sms_notifications: boolean;
}

export const updateNotificationPreferences = async (
  preferences: NotificationPreferences
): Promise<NotificationPreferences> => {
  const response = await apiClient.put<NotificationPreferences>(
    `${OWNER_BASE_PATH}/notification-preferences`,
    preferences
  );
  return response.data;
};

export const deleteAccount = async (password: string): Promise<void> => {
  await apiClient.post(`${OWNER_BASE_PATH}/delete-account`, { password });
};
