# RBAC Testing Guide

## Overview

This guide provides step-by-step instructions for testing the complete RBAC (Role-Based Access Control) implementation in the Propertifi application.

## Test Environment

- **Backend API**: http://localhost:8000
- **Angular App**: http://localhost:4200
- **Database**: MySQL (Docker container on port 33060)

## Test Users

| User | Email | Password | Type | Role | Expected Permissions Count |
|------|-------|----------|------|------|---------------------------|
| Admin | admin@propertifi.com | TBD | admin | admin | 26 (all permissions) |
| Property Manager | john@smithpm.com | TBD | pm | property_manager | 12 |
| Owner | robert@example.com | password123 | owner | owner | 8 |

## Permission Matrix

### Admin (26 permissions)
```
User Management: view_users, create_users, edit_users, delete_users, manage_users
Role Management: view_roles, create_roles, edit_roles, delete_roles, manage_roles
Property Management: view_properties, create_properties, edit_properties, delete_properties, manage_properties
Lead Management: view_leads, create_leads, edit_leads, delete_leads, assign_leads, manage_leads
Analytics: view_analytics, view_reports, export_reports
Settings: manage_settings, manage_system_settings
Billing: view_billing, manage_billing, view_invoices
Support: view_support_tickets, manage_support_tickets
Marketplace: view_marketplace, manage_marketplace
```

### Property Manager (12 permissions)
```
Property Management: view_properties, create_properties, edit_properties, manage_properties
Lead Management: view_leads, create_leads, edit_leads, assign_leads
Analytics: view_analytics, view_reports
Support: view_support_tickets
Marketplace: view_marketplace
```

### Owner (8 permissions)
```
Property Management: view_properties, edit_properties
Analytics: view_analytics, view_reports
Billing: view_billing, view_invoices
Support: view_support_tickets
Marketplace: view_marketplace
```

---

## Test Suite 1: Backend API Testing

### Test 1.1: Login Endpoint - Owner

```bash
curl -X POST http://localhost:8000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "robert@example.com", "password": "password123"}' | jq '.'
```

**Expected Response:**
- ✅ Status: 200 OK
- ✅ Contains `access_token`
- ✅ Contains `user` object
- ✅ User has `permissions` array with 8 items
- ✅ Permissions match owner role

**Actual Permissions:**
```json
[
  "view_properties",
  "edit_properties",
  "view_analytics",
  "view_reports",
  "view_billing",
  "view_invoices",
  "view_support_tickets",
  "view_marketplace"
]
```

### Test 1.2: Get User Endpoint

```bash
# Use token from previous login
curl -X GET http://localhost:8000/api/v2/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq '.'
```

**Expected Response:**
- ✅ Status: 200 OK
- ✅ Returns user object
- ✅ Permissions array is present and matches login response

### Test 1.3: Login with Different User Types

Repeat Test 1.1 with:
- Admin user (admin@propertifi.com)
- Property Manager (john@smithpm.com)

**Note:** Passwords need to be set for these users first.

---

## Test Suite 2: Angular Frontend Testing

### Pre-Test Setup

Before testing, ensure:
1. ✅ Backend server is running on port 8000
2. ✅ Angular app is running on port 4200
3. ✅ Browser DevTools console is open
4. ✅ Redux DevTools extension is installed (optional but recommended)

### Test 2.1: Login Flow - Owner User

**Steps:**
1. Navigate to http://localhost:4200
2. If not on login page, click "Logout" or navigate to `/auth/login`
3. Enter credentials:
   - Email: `robert@example.com`
   - Password: `password123`
4. Click "Login"

**Verification:**
- ✅ No console errors
- ✅ Redirected to appropriate dashboard
- ✅ User information displayed correctly
- ✅ Navigation menu reflects user permissions

**Check NgRx Store (Redux DevTools):**
```typescript
state.auth = {
  user: {
    id: 7,
    name: "Robert Davis",
    email: "robert@example.com",
    type: "owner",
    permissions: [
      "view_properties",
      "edit_properties",
      "view_analytics",
      "view_reports",
      "view_billing",
      "view_invoices",
      "view_support_tickets",
      "view_marketplace"
    ]
  },
  token: "4|...",
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

**Check LocalStorage:**
```javascript
// In browser console
console.log(localStorage.getItem('auth_token'));
console.log(localStorage.getItem('user'));
```

### Test 2.2: Permission Service Testing

**Open Browser Console and Test:**

```javascript
// Get PermissionService instance (if accessible)
// Or check component behavior

// These should work based on owner permissions:
- Can view properties page
- Can edit own properties
- Can view analytics
- Can view billing

// These should NOT work:
- Cannot create new users
- Cannot delete properties
- Cannot manage system settings
- Cannot assign leads
```

### Test 2.3: Route Guard Testing

**Test Protected Routes:**

1. **Try accessing admin-only route** (while logged in as owner)
   - Navigate to: http://localhost:4200/admin
   - **Expected**: Redirect to `/unauthorized`
   - **Reason**: Owner doesn't have admin role

2. **Try accessing permission-protected route**
   - Navigate to user management or any admin feature
   - **Expected**: Redirect to `/unauthorized` with reason

3. **Access allowed route**
   - Navigate to properties page
   - **Expected**: Successfully loads

### Test 2.4: Permission Directives Testing

**Visual UI Testing:**

Login as **Owner** and check:

1. **Navigation Menu**
   - ✅ Properties link visible
   - ✅ Analytics link visible
   - ✅ Billing link visible
   - ✅ Support link visible
   - ❌ Admin Panel link hidden
   - ❌ User Management link hidden
   - ❌ Role Management link hidden

2. **Property Page** (if exists)
   - ✅ View button/section visible
   - ✅ Edit button visible
   - ❌ Delete button hidden
   - ❌ Create new property button hidden (no create_properties permission)

3. **Check for `*appHasPermission` directive usage**
   - Elements should show/hide based on permissions
   - Use browser inspector to verify elements are removed from DOM, not just hidden

### Test 2.5: Role-Based Rendering

**Test `*appHasRole` directive:**

1. Login as Owner
   - Admin-only sections should be hidden
   - Owner sections should be visible

2. Login as Admin (after setting password)
   - All sections should be visible
   - Full navigation menu

### Test 2.6: Multiple User Types

**Repeat Tests 2.1-2.5 for:**

1. **Admin User**
   - Should see all navigation items
   - Should access all routes
   - Should have all 26 permissions

2. **Property Manager**
   - Should see PM-specific navigation
   - Should access property and lead management
   - Should have 12 permissions

---

## Test Suite 3: NgRx Selectors Testing

### Test 3.1: Permission Selectors

**Open Browser Console after logging in:**

```javascript
// If you have access to store
// Check these selectors work correctly:

// selectUserPermissions
// Should return array of permission strings

// selectHasPermission('edit_users')
// Should return true for admin, false for owner

// selectHasAllPermissions(['view_properties', 'edit_properties'])
// Should return true for owner (has both)

// selectHasAnyPermission(['delete_properties', 'view_properties'])
// Should return true for owner (has view_properties)
```

### Test 3.2: Role Selectors

```javascript
// selectIsAdmin - true only for admin users
// selectIsOwner - true only for owner users
// selectIsPropertyManager - true only for pm users
```

---

## Test Suite 4: Permission Edge Cases

### Test 4.1: No Permissions

1. Create a test user with no role_id
2. Login
3. **Expected**:
   - Empty permissions array
   - Minimal UI (only public sections)
   - Most routes blocked

### Test 4.2: Token Expiration

1. Login successfully
2. Wait for token expiration or manually clear token
3. Try to access protected route
4. **Expected**: Redirect to login

### Test 4.3: Unauthorized Page

1. Access route without required permission
2. **Expected**:
   - See unauthorized page
   - Error message explains the issue
   - Shows required permissions if applicable
   - Provides link back to dashboard

---

## Test Suite 5: Integration Testing

### Test 5.1: Complete User Journey - Owner

1. **Login** as owner
2. **Navigate** to properties page
3. **View** property details
4. **Edit** property (should work)
5. **Try to delete** property (should be blocked or hidden)
6. **Navigate** to analytics
7. **View** reports
8. **Navigate** to billing
9. **View** invoices
10. **Try to access** admin panel (should redirect to unauthorized)
11. **Logout**

**Verification Points:**
- All allowed actions work smoothly
- Blocked actions are properly prevented
- No console errors
- Proper feedback for unauthorized actions

### Test 5.2: Permission-Based Form Fields

If forms adjust based on permissions:

1. Login as Owner
2. Open property edit form
3. **Expected**: Can edit basic fields, but not advanced admin fields

4. Login as Admin
5. Open same property edit form
6. **Expected**: All fields editable

---

## Test Suite 6: WebSocket & Real-time Features

### Test 6.1: Pusher Integration with Permissions

If WebSocket/Pusher is integrated:

1. Login as owner
2. Check that notifications are filtered by permissions
3. Should only receive notifications for permitted resources

---

## Checklist Summary

### Backend Tests
- [ ] Owner login returns 8 permissions
- [ ] Admin login returns 26 permissions
- [ ] Property Manager login returns 12 permissions
- [ ] `/api/v2/auth/user` endpoint returns permissions
- [ ] All permission arrays match role definitions

### Frontend Tests
- [ ] Login flow works for all user types
- [ ] Permissions stored correctly in NgRx store
- [ ] Permissions persisted in localStorage
- [ ] Route guards block unauthorized access
- [ ] Permission guards redirect to unauthorized page
- [ ] `*appHasPermission` directive shows/hides elements correctly
- [ ] `*appHasRole` directive works for role-based UI
- [ ] Navigation menu adjusts based on permissions
- [ ] Unauthorized page displays properly

### Service Tests
- [ ] PermissionService.hasPermission() works correctly
- [ ] PermissionService.hasAllPermissions() works correctly
- [ ] PermissionService.hasAnyPermission() works correctly
- [ ] PermissionService.hasRole() works correctly

### Integration Tests
- [ ] Complete user journey works end-to-end
- [ ] No console errors during normal operation
- [ ] Proper error handling for unauthorized access

---

## Known Issues

Document any issues found during testing:

1. **Issue**: [Description]
   - **Steps to Reproduce**:
   - **Expected**:
   - **Actual**:
   - **Fix**:

---

## Testing Notes

### Browser Console Checks

Useful console commands for testing:

```javascript
// Check current auth state
console.log(localStorage.getItem('auth_token'));
console.log(localStorage.getItem('user'));

// Check Redux store (if DevTools installed)
// View state.auth

// Check permissions
const user = JSON.parse(localStorage.getItem('user'));
console.log('User permissions:', user?.permissions);
console.log('User type:', user?.type);
```

### Network Tab Inspection

Monitor these requests:
- POST `/api/v2/auth/login` - Should return user with permissions
- GET `/api/v2/auth/user` - Should return user with permissions
- Any API request should include `Authorization: Bearer <token>` header

---

## Next Steps After Testing

Based on test results:

1. ✅ If all tests pass → Move to Property Management features
2. ⚠️ If issues found → Document and fix before proceeding
3. 📝 Update this document with actual test results
4. 🔄 Add automated E2E tests for RBAC flows

---

## Test Results Log

### Test Run: [Date/Time]
**Tester**: [Name]
**Environment**: [Local/Dev/Staging]

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Backend Login - Owner | ✅ PASS | All permissions returned correctly |
| 1.2 | Get User Endpoint | ⏳ PENDING | |
| 2.1 | Frontend Login Flow | ⏳ PENDING | |
| ... | ... | ... | ... |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-07
**Created By**: AI Assistant
