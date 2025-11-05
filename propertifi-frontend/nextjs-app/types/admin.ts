/**
 * Admin Dashboard Types
 *
 * TypeScript type definitions for admin features including
 * user management, roles, permissions, and analytics.
 */

// ============================================================================
// User Management Types
// ============================================================================

export type UserType = 'admin' | 'pm' | 'owner' | 'AccountManager';

export type UserStatus = 0 | 1 | 2 | 3; // 0=inactive, 1=active, 2=suspended, 3=deleted

export interface Role {
  id: number;
  name: string;
  title: string;
  description: string | null;
  permissions: string[];
  status: number;
  is_admin: boolean;
  is_default: boolean;
  users_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  tier_id: number;
  is_active: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  tier?: Tier;
  created_at: string;
  updated_at: string;
}

export interface Tier {
  id: number;
  name: string;
  title: string;
  price: number;
  priority: number;
  lead_cap: number;
  exclusivity_hours: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  type: UserType;
  name: string;
  email: string;
  mobile: string | null;
  company_name: string | null;
  role_id: number | null;
  status: UserStatus;
  is_verified: boolean;
  verified_at: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role?: Role;
  preferences?: UserPreferences;
}

export interface UserStatistics {
  total_leads: number;
  viewed_leads: number;
  responded_leads: number;
}

export interface UserWithStats extends AdminUser {
  statistics: UserStatistics;
}

export interface CreateUserPayload {
  type: UserType;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  company_name?: string;
  role_id?: number;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  type?: UserType;
  name?: string;
  email?: string;
  password?: string;
  mobile?: string;
  company_name?: string;
  role_id?: number;
  status?: UserStatus;
  is_verified?: boolean;
}

export interface BulkUpdatePayload {
  user_ids: number[];
  action: 'activate' | 'deactivate' | 'verify' | 'unverify' | 'delete';
}

export interface UserFilters {
  type?: UserType;
  is_verified?: boolean;
  status?: UserStatus;
  role_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// ============================================================================
// Role & Permission Types
// ============================================================================

export interface PermissionCategory {
  label: string;
  description: string;
  permissions: {
    [key: string]: {
      label: string;
      description: string;
    };
  };
}

export interface AvailablePermissions {
  all_permissions: string[];
  categories: {
    [category: string]: PermissionCategory;
  };
}

export interface CreateRolePayload {
  name: string;
  title: string;
  description?: string;
  permissions: string[];
  status?: number;
  is_admin?: boolean;
  is_default?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  title?: string;
  description?: string;
  permissions?: string[];
  status?: number;
  is_admin?: boolean;
  is_default?: boolean;
}

export interface CloneRolePayload {
  name: string;
  title?: string;
}

export interface RoleWithUsers extends Role {
  sample_users?: Array<{
    id: number;
    name: string;
    email: string;
    type: UserType;
  }>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface DashboardStats {
  overview: {
    total_users: number;
    active_users: number;
    total_property_managers: number;
    verified_property_managers: number;
    total_owners: number;
    total_leads: number;
    distributed_leads: number;
    pending_leads: number;
  };
  lead_stats: {
    total_this_month: number;
    total_last_month: number;
    growth_percentage: number;
    average_quality_score: number;
    distribution_rate: number;
    view_rate: number;
    response_rate: number;
  };
  user_stats: {
    new_this_month: number;
    pending_verification: number;
    pm_by_tier: Array<{
      tier_name: string;
      count: number;
    }>;
  };
  revenue_stats: {
    mrr: number;
    arr: number;
    active_subscriptions: number;
    average_revenue_per_user: number;
  };
  engagement_stats: {
    average_lead_view_time: number;
    average_response_time_hours: number;
    template_downloads_this_month: number;
    calculator_uses_this_month: number;
  };
  recent_activity: {
    recent_leads: Array<{
      id: number;
      name: string;
      email: string;
      property_type: string;
      state: string;
      created_at: string;
    }>;
    recent_users: Array<{
      id: number;
      name: string;
      email: string;
      type: UserType;
      created_at: string;
    }>;
  };
  growth_trends: Array<{
    month: string;
    leads: number;
    users: number;
    revenue: number;
  }>;
}

export interface LeadAnalytics {
  summary: {
    total_leads: number;
    average_quality_score: number;
    total_distributed: number;
    total_undistributed: number;
  };
  by_state: Array<{
    state: string;
    count: number;
  }>;
  by_property_type: Array<{
    property_type: string;
    count: number;
  }>;
  by_source: Array<{
    source: string;
    count: number;
  }>;
  quality_distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface PMAnalytics {
  id: number;
  name: string;
  email: string;
  company_name: string | null;
  is_verified: boolean;
  tier_name: string | null;
  total_leads: number;
  viewed_leads: number;
  responded_leads: number;
  avg_match_score: number;
  view_rate: number;
  response_rate: number;
}

export interface RevenueAnalytics {
  mrr: number;
  arr: number;
  subscriptions_by_tier: Array<{
    id: number;
    name: string;
    title: string;
    price: number;
    subscriber_count: number;
    monthly_revenue: number;
  }>;
  subscription_growth: Array<{
    month: string;
    active_subscriptions: number;
  }>;
  average_revenue_per_user: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: {
    [field: string]: string[];
  };
}
