/**
 * API Type Definitions
 * Types for API requests and responses from the Laravel backend
 */

// ============================================================================
// Lead/Form Submission Types
// ============================================================================

export interface LeadSubmissionRequest {
  // Property Information
  property_type: string; // 'single-family' | 'multi-family' | 'hoa-coa' | 'commercial'
  street_address: string;
  city: string;
  state: string;
  zip_code: string;

  // Property Details
  number_of_units?: number;
  square_footage?: number;
  additional_services: string[]; // Array of service IDs

  // Contact Information
  full_name: string;
  email: string;
  phone: string;
  preferred_contact: 'email' | 'phone';

  // Optional metadata
  source?: string; // e.g., 'get-started-form'
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  lead_id?: number;
  data?: {
    id: number;
    confirmation_number: string;
    matched_managers_count?: number;
  };
}

// ============================================================================
// Property Manager Types
// ============================================================================

export interface PropertyManager {
  id: number;
  slug: string;
  company_name: string;
  description: string;
  logo_url?: string;

  // Location
  address: string;
  city: string;
  state: string;
  state_code: string;
  zip_code: string;

  // Contact
  phone: string;
  email: string;
  website?: string;

  // Stats
  rating: number;
  review_count: number;
  years_experience: number;
  properties_managed: number;
  management_fee: string;

  // Features
  property_types: string[];
  services: string[];
  verified: boolean;
  featured: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PropertyManagerListResponse {
  success: boolean;
  data: PropertyManager[];
  meta?: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

export interface PropertyManagerDetailResponse {
  success: boolean;
  data: PropertyManager;
}

// ============================================================================
// Location Types
// ============================================================================

export interface State {
  id: number;
  name: string;
  code: string;
  slug: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  state_code: string;
  manager_count?: number;
}

export interface StatesResponse {
  success: boolean;
  data: State[];
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
}

// ============================================================================
// Testimonial Types
// ============================================================================

export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
  image_url?: string;
  location?: string;
  created_at: string;
}

export interface TestimonialsResponse {
  success: boolean;
  data: Testimonial[];
}

// ============================================================================
// Blog Types
// ============================================================================

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string; // Only included in detail view
  featured_image_url?: string;
  category: string;
  author?: {
    name: string;
    avatar_url?: string;
  };
  published_at: string;
  read_time?: number; // minutes
  tags?: string[];
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  meta?: {
    total: number;
    current_page: number;
    per_page: number;
  };
}

export interface BlogDetailResponse {
  success: boolean;
  data: BlogPost;
  related?: BlogPost[];
}

// ============================================================================
// Validation Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // Laravel validation errors format
  validation_errors?: ValidationError[]; // Normalized format
}

// ============================================================================
// Generic API Response
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
