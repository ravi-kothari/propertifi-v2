/**
 * Admin API Service
 *
 * API functions for admin dashboard operations including user management,
 * role management, analytics, and system administration.
 */

import { apiClient as api } from './api';
import type {
  AdminUser,
  UserWithStats,
  CreateUserPayload,
  UpdateUserPayload,
  BulkUpdatePayload,
  UserFilters,
  Role,
  RoleWithUsers,
  CreateRolePayload,
  UpdateRolePayload,
  CloneRolePayload,
  AvailablePermissions,
  DashboardStats,
  LeadAnalytics,
  PMAnalytics,
  RevenueAnalytics,
  PaginatedResponse,
  ApiResponse,
} from '@/types/admin';

const BASE_PATH = '/api/admin';

// ============================================================================
// Dashboard & Analytics
// ============================================================================

/**
 * Get admin dashboard overview statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiResponse<DashboardStats>>(`${BASE_PATH}/dashboard`);
  return response.data.data;
}

/**
 * Clear dashboard cache
 */
export async function clearDashboardCache(): Promise<void> {
  await api.post(`${BASE_PATH}/dashboard/clear-cache`);
}

/**
 * Get lead analytics with optional filters
 */
export async function getLeadAnalytics(filters?: {
  start_date?: string;
  end_date?: string;
  state?: string;
  property_type?: string;
}): Promise<LeadAnalytics> {
  const response = await api.get<ApiResponse<LeadAnalytics>>(
    `${BASE_PATH}/analytics/leads`,
    { params: filters }
  );
  return response.data.data;
}

/**
 * Get property manager performance analytics
 */
export async function getPMAnalytics(page = 1, perPage = 20): Promise<PaginatedResponse<PMAnalytics>> {
  const response = await api.get<PaginatedResponse<PMAnalytics>>(
    `${BASE_PATH}/analytics/property-managers`,
    { params: { page, per_page: perPage } }
  );
  return response.data;
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  const response = await api.get<ApiResponse<RevenueAnalytics>>(
    `${BASE_PATH}/analytics/revenue`
  );
  return response.data.data;
}

// ============================================================================
// User Management
// ============================================================================

/**
 * Get paginated list of users with optional filters
 */
export async function getUsers(filters?: UserFilters): Promise<PaginatedResponse<AdminUser>> {
  const response = await api.get<PaginatedResponse<AdminUser>>(
    `${BASE_PATH}/users`,
    { params: filters }
  );
  return response.data;
}

/**
 * Get single user by ID with statistics
 */
export async function getUser(id: number): Promise<UserWithStats> {
  const response = await api.get<ApiResponse<{ user: AdminUser; statistics: any }>>(
    `${BASE_PATH}/users/${id}`
  );
  return {
    ...response.data.data.user,
    statistics: response.data.data.statistics,
  };
}

/**
 * Create new user
 */
export async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  const response = await api.post<ApiResponse<AdminUser>>(
    `${BASE_PATH}/users`,
    payload
  );
  return response.data.data;
}

/**
 * Update existing user
 */
export async function updateUser(id: number, payload: UpdateUserPayload): Promise<AdminUser> {
  const response = await api.put<ApiResponse<AdminUser>>(
    `${BASE_PATH}/users/${id}`,
    payload
  );
  return response.data.data;
}

/**
 * Delete user (soft delete)
 */
export async function deleteUser(id: number): Promise<void> {
  await api.delete(`${BASE_PATH}/users/${id}`);
}

/**
 * Verify/approve a property manager
 */
export async function verifyUser(
  id: number,
  isVerified: boolean,
  notes?: string
): Promise<AdminUser> {
  const response = await api.post<ApiResponse<AdminUser>>(
    `${BASE_PATH}/users/${id}/verify`,
    {
      is_verified: isVerified,
      verification_notes: notes,
    }
  );
  return response.data.data;
}

/**
 * Assign role to user
 */
export async function assignRole(userId: number, roleId: number): Promise<AdminUser> {
  const response = await api.post<ApiResponse<AdminUser>>(
    `${BASE_PATH}/users/${userId}/assign-role`,
    { role_id: roleId }
  );
  return response.data.data;
}

/**
 * Impersonate user (for support/debugging)
 */
export async function impersonateUser(id: number): Promise<{
  user: AdminUser;
  token: string;
  impersonated_by: string;
}> {
  const response = await api.post<ApiResponse<any>>(
    `${BASE_PATH}/users/${id}/impersonate`
  );
  return response.data.data;
}

/**
 * Bulk update users
 */
export async function bulkUpdateUsers(payload: BulkUpdatePayload): Promise<{
  affected_count: number;
  message: string;
}> {
  const response = await api.post<ApiResponse<any>>(
    `${BASE_PATH}/users/bulk-update`,
    payload
  );
  return response.data.data;
}

// ============================================================================
// Role Management
// ============================================================================

/**
 * Get all roles with optional filters
 */
export async function getRoles(filters?: {
  status?: number;
  is_admin?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}): Promise<PaginatedResponse<Role>> {
  const response = await api.get<PaginatedResponse<Role>>(
    `${BASE_PATH}/roles`,
    { params: filters }
  );
  return response.data;
}

/**
 * Get single role by ID with sample users
 */
export async function getRole(id: number): Promise<RoleWithUsers> {
  const response = await api.get<ApiResponse<{ role: Role; sample_users: any[] }>>(
    `${BASE_PATH}/roles/${id}`
  );
  return {
    ...response.data.data.role,
    sample_users: response.data.data.sample_users,
  };
}

/**
 * Create new role
 */
export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const response = await api.post<ApiResponse<Role>>(
    `${BASE_PATH}/roles`,
    payload
  );
  return response.data.data;
}

/**
 * Update existing role
 */
export async function updateRole(id: number, payload: UpdateRolePayload): Promise<Role> {
  const response = await api.put<ApiResponse<Role>>(
    `${BASE_PATH}/roles/${id}`,
    payload
  );
  return response.data.data;
}

/**
 * Delete role
 */
export async function deleteRole(id: number): Promise<void> {
  await api.delete(`${BASE_PATH}/roles/${id}`);
}

/**
 * Clone existing role
 */
export async function cloneRole(id: number, payload: CloneRolePayload): Promise<Role> {
  const response = await api.post<ApiResponse<Role>>(
    `${BASE_PATH}/roles/${id}/clone`,
    payload
  );
  return response.data.data;
}

/**
 * Get all available permissions
 */
export async function getAvailablePermissions(): Promise<AvailablePermissions> {
  const response = await api.get<ApiResponse<AvailablePermissions>>(
    `${BASE_PATH}/permissions/available`
  );
  return response.data.data;
}
