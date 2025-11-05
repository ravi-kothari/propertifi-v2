# Phase 2: Backend API Integration - Progress Report

**Started:** 2025-10-31
**Status:** 🟡 IN PROGRESS (25% Complete)

---

## Overview

Phase 2 focuses on connecting all frontend components to real backend APIs, replacing mock data with actual data fetching using React Query hooks.

---

## Completed Tasks ✅

### 1. ✅ Updated LoginForm Component

**File:** `/components/auth/LoginForm.tsx`

**Changes:**
- Migrated from manual `setAuth()` to new `login()` method
- Added comprehensive error handling with `ValidationError` and `ApiClientError`
- Implemented field-level error display from API validation
- Added loading spinner with proper disabled states
- Supports `returnUrl` parameter for redirect after login
- Added "Remember me" and "Forgot password" UI elements

**Key Features:**
```typescript
const { login, isLoading } = useAuth();

try {
  await login(email, password);
  const returnUrl = searchParams.get('returnUrl') || '/property-manager';
  router.push(returnUrl);
} catch (error) {
  // Handles ValidationError (422) and ApiClientError
}
```

---

### 2. ✅ Updated RegisterForm Component

**File:** `/components/auth/RegisterForm.tsx`

**Changes:**
- Migrated to new `register()` method from useAuth
- Enhanced password validation (uppercase + number required)
- Added password confirmation field with match validation
- Comprehensive error handling (field-level + general)
- Loading states and spinner
- Password strength helper text

**Enhanced Validation:**
```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
});
```

---

## In Progress Tasks 🟡

### 3. 🟡 Remove ProtectedRoute Component

**Status:** Pending
**Reason:** Middleware now handles route protection server-side

**Files to Update:**
- Delete `/components/auth/ProtectedRoute.tsx`
- Remove imports from `/app/(dashboard)/property-manager/layout.tsx`

---

### 4. 🟡 Create Lead Types and Interfaces

**Status:** Pending

**Planned File:** `/types/leads.ts`

**Required Types:**
```typescript
export type LeadStatus = 'new' | 'viewed' | 'contacted' | 'qualified' | 'closed' | 'archived';

export interface Lead {
  id: number;
  property_type: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  number_of_units?: number;
  square_footage?: number;
  additional_services: string[];
  full_name: string;
  email: string;
  phone: string;
  preferred_contact: 'email' | 'phone';
  status: LeadStatus;
  viewed_at?: string | null;
  responded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadResponse {
  id: number;
  lead_id: number;
  response_type: 'contact_info' | 'availability' | 'price_quote' | 'decline';
  message: string;
  contact_info?: {
    phone?: string;
    email?: string;
    preferred_time?: string;
  };
  availability?: {
    date: string;
    time: string;
  };
  price_quote?: {
    amount: number;
    frequency: 'monthly' | 'yearly';
    details: string;
  };
  created_at: string;
}

export interface LeadNote {
  id: number;
  lead_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}
```

---

### 5. 🟡 Create useLeads Hook with React Query

**Status:** Pending

**Planned File:** `/hooks/useLeads.ts`

**Implementation Plan:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, patch } from '@/lib/api';
import { Lead, LeadResponse, LeadNote } from '@/types/leads';

// Fetch all leads for a property manager
export function useLeads(pmId: string | number) {
  return useQuery({
    queryKey: ['leads', pmId],
    queryFn: () => get<{ data: Lead[] }>(`/v2/property-managers/${pmId}/leads`),
    select: (data) => data.data,
  });
}

// Mark lead as viewed
export function useMarkLeadViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pmId, leadId }: { pmId: number; leadId: number }) =>
      post(`/v2/property-managers/${pmId}/leads/${leadId}/view`, {}),
    onSuccess: (_, { pmId, leadId }) => {
      // Optimistically update the lead
      queryClient.setQueryData<Lead[]>(['leads', pmId], (old) =>
        old?.map(lead =>
          lead.id === leadId ? { ...lead, viewed_at: new Date().toISOString() } : lead
        )
      );
    },
  });
}

// Submit response to lead
export function useSubmitResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: number; data: any }) =>
      post<LeadResponse>(`/v2/leads/${leadId}/responses`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// Add note to lead
export function useAddLeadNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, content }: { leadId: number; content: string }) =>
      post<LeadNote>(`/v2/leads/${leadId}/notes`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
```

---

### 6. 🟡 Connect LeadPipeline to Real API

**Status:** Pending

**File to Update:** `/components/dashboard/pm/LeadPipeline.tsx`

**Current Issue:** Using hardcoded `initialLeads` array

**Planned Changes:**
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import LeadCard from '@/components/leads/LeadCard';

export default function LeadPipeline() {
  const { user } = useAuth();
  const { data: leads, isLoading, isError } = useLeads(user?.id || 0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load leads" />;
  }

  const filteredLeads = leads?.filter(lead => {
    if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
    // Date filtering logic
    return true;
  });

  return (
    <div>
      {/* Filters */}
      {/* Lead Cards by Status */}
    </div>
  );
}
```

---

### 7. 🟡 Create LeadCard with Real Data

**Status:** Pending

**File to Update:** `/components/leads/LeadCard.tsx`

**Required Features:**
- Display lead details from API
- Mark as viewed when opened
- Show response history
- Display notes
- Action buttons (respond, skip, save)

---

### 8. 🟡 Add Loading States and Error Handling

**Status:** Pending

**Components Needed:**
- `/components/ui/LoadingSpinner.tsx`
- `/components/ui/ErrorMessage.tsx`
- `/components/ui/Skeleton.tsx` (for skeleton screens)

---

## Pending Tasks 📋

### PM Dashboard Integration
- [ ] Create Lead types
- [ ] Implement useLeads hook
- [ ] Connect LeadPipeline
- [ ] Update LeadCard
- [ ] Add loading/error states
- [ ] Implement lead filtering
- [ ] Add drag-and-drop (optional enhancement)

### Lead Response System
- [ ] Create ResponseForm component
- [ ] Implement response submission
- [ ] Add response history display
- [ ] Create notes functionality
- [ ] Add optimistic UI updates

### Analytics Dashboard
- [ ] Create analytics types
- [ ] Implement useAnalytics hook
- [ ] Connect MetricsCard to real data
- [ ] Implement Chart.js visualizations
- [ ] Add date range filtering
- [ ] Export functionality

### Template Library
- [ ] Create template types
- [ ] Implement useTemplates hook
- [ ] Connect TemplateLibrary to API
- [ ] Implement download functionality
- [ ] Add download tracking
- [ ] Create template detail modal

---

## API Endpoints to Integrate

### Authentication (✅ Complete)
- `POST /api/v2/auth/login` ✅
- `POST /api/v2/auth/register` ✅
- `POST /api/v2/auth/logout` ✅
- `GET /api/v2/auth/user` ✅

### Leads (🟡 Pending)
- `GET /api/v2/property-managers/{pmId}/leads`
- `POST /api/v2/property-managers/{pmId}/leads/{leadId}/view`
- `POST /api/v2/leads/{leadId}/responses`
- `GET /api/v2/leads/{leadId}/responses`
- `POST /api/v2/leads/{leadId}/notes`
- `GET /api/v2/leads/{leadId}/notes`
- `PATCH /api/v2/leads/{leadId}/status`

### Analytics (🟡 Pending)
- `GET /api/v2/analytics/metrics`
- `GET /api/v2/analytics/conversion-funnel`
- `GET /api/v2/analytics/response-rates`
- `GET /api/v2/analytics/time-series`

### Templates (🟡 Pending)
- `GET /api/v2/templates`
- `GET /api/v2/templates/{id}`
- `POST /api/v2/templates/{id}/download`
- `GET /api/v2/templates/categories`

---

## Testing Checklist

### Auth Forms ✅
- [x] Login with valid credentials
- [x] Login with invalid email format
- [x] Login with short password
- [x] Handle API validation errors
- [x] Handle API connection errors
- [x] Loading state during submission
- [x] Return URL preservation
- [x] Register with valid data
- [x] Register with mismatched passwords
- [x] Register with weak password
- [x] Field-level error display

### Leads Integration 🟡
- [ ] Fetch leads on page load
- [ ] Display leads in pipeline
- [ ] Mark lead as viewed
- [ ] Filter leads by status
- [ ] Filter leads by date
- [ ] Submit response to lead
- [ ] Add note to lead
- [ ] Optimistic UI updates
- [ ] Error handling on failed requests
- [ ] Loading states during fetch

---

## Known Issues

1. **ProtectedRoute Still Used:**
   - Layout still imports ProtectedRoute component
   - Should be removed since middleware handles protection

2. **Mock Data in Components:**
   - LeadPipeline still uses `initialLeads` array
   - TemplateLibrary uses hardcoded templates
   - Analytics components use hardcoded metrics

3. **Missing Error Boundaries:**
   - Need error boundaries for each major section
   - Already added global ones in Phase 1

---

## Next Steps (Priority Order)

1. **High Priority:**
   - Remove ProtectedRoute component
   - Create Lead types and interfaces
   - Implement useLeads hook
   - Connect LeadPipeline to real API

2. **Medium Priority:**
   - Create loading/error components
   - Implement lead response system
   - Add lead notes functionality

3. **Lower Priority:**
   - Analytics dashboard integration
   - Template library integration
   - Advanced features (drag-and-drop, etc.)

---

## Performance Considerations

- React Query caching reduces API calls
- Optimistic UI updates for better UX
- Skeleton screens for perceived performance
- Proper error boundaries prevent app crashes

---

## Phase 2 Estimated Completion

**Auth Integration:** ✅ 100% Complete (2/2 tasks)
**Leads Integration:** 🟡 0% Complete (0/6 tasks)
**Analytics Integration:** 🟡 0% Complete (0/5 tasks)
**Templates Integration:** 🟡 0% Complete (0/4 tasks)

**Overall Phase 2 Progress: 25%** (Auth complete, 3 major features pending)

**Estimated Time Remaining:** 2-3 weeks

---

**Last Updated:** 2025-10-31
**Next Update:** After leads integration complete
