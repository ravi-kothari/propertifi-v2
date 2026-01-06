# RBAC Manual Testing Checklist

## Pre-Testing Setup ✅

- [ ] Backend server running on http://localhost:8000
- [ ] Angular app running on http://localhost:4200
- [ ] Browser DevTools open (F12)
- [ ] Network tab open in DevTools
- [ ] Console tab open in DevTools
- [ ] Redux DevTools extension installed (optional)

## Test Users Available

| Email | Password | Type | Expected Permissions |
|-------|----------|------|---------------------|
| robert@example.com | password123 | owner | 8 permissions |
| admin@propertifi.com | TBD | admin | 26 permissions |
| john@smithpm.com | TBD | pm | 12 permissions |

---

## Test Suite 1: Owner User Login Flow

### 1.1 Login Process

- [ ] Navigate to http://localhost:4200
- [ ] Click "Login" or navigate to `/auth/login`
- [ ] Enter credentials:
  - Email: `robert@example.com`
  - Password: `password123`
- [ ] Click "Login" button
- [ ] ✅ No console errors
- [ ] ✅ Redirected away from login page
- [ ] ✅ User information displayed somewhere in UI

**Console Check:**
```javascript
// Paste browser-console-tests.js content and review output
```

### 1.2 Verify LocalStorage

Open Console and run:
```javascript
console.log('Token:', localStorage.getItem('auth_token'));
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Permissions:', user?.permissions);
```

**Expected Results:**
- [ ] `auth_token` is present and non-null
- [ ] `user` object exists
- [ ] `user.permissions` is an array with 8 items
- [ ] Permissions match:
  ```javascript
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

### 1.3 Verify NgRx Store

If Redux DevTools is installed:

- [ ] Open Redux DevTools
- [ ] Find `auth` state
- [ ] Verify structure:
  ```javascript
  {
    user: { /* user object with permissions */ },
    token: "string",
    isAuthenticated: true,
    isLoading: false,
    error: null
  }
  ```
- [ ] `user.permissions` array has 8 items
- [ ] `isAuthenticated` is `true`

### 1.4 Verify Network Requests

Check Network tab for login request:

- [ ] POST request to `/api/v2/auth/login`
- [ ] Request body contains email and password
- [ ] Response status: 200 OK
- [ ] Response contains:
  - [ ] `access_token`
  - [ ] `token_type: "Bearer"`
  - [ ] `user` object with `permissions` array

---

## Test Suite 2: Permission-Based Route Guards

### 2.1 Test Allowed Routes (Owner)

Navigate to these routes - should all work:

- [ ] `/dashboard` - Loads successfully
- [ ] `/properties` - Loads successfully (has view_properties)
- [ ] `/analytics` - Loads successfully (has view_analytics)
- [ ] `/billing` - Loads successfully (has view_billing)

**For Each Route:**
- ✅ Page loads without redirect
- ✅ No console errors
- ✅ Content is visible

### 2.2 Test Blocked Routes (Owner)

Try accessing these routes - should all redirect:

- [ ] `/admin` - Should redirect to `/unauthorized`
- [ ] `/users` - Should redirect to `/unauthorized`
- [ ] `/roles` - Should redirect to `/unauthorized`
- [ ] `/properties/create` - Should redirect to `/unauthorized` (no create_properties permission)

**For Each Route:**
- ✅ Immediately redirected to `/unauthorized`
- ✅ Query params show `reason=insufficient-permissions`
- ✅ Unauthorized page displays appropriate message

### 2.3 Test Unauthorized Page

When redirected to `/unauthorized`:

- [ ] Page displays clear error message
- [ ] Shows "insufficient permissions" or similar
- [ ] Provides navigation back to dashboard
- [ ] Styling is appropriate (not broken)
- [ ] No console errors

---

## Test Suite 3: Permission Directives in UI

### 3.1 Navigation Menu

Check navigation menu visibility:

**Should Be Visible:**
- [ ] Dashboard link
- [ ] Properties link
- [ ] Analytics link
- [ ] Billing link
- [ ] Support link
- [ ] Marketplace link

**Should Be Hidden:**
- [ ] Admin Panel link (no admin role)
- [ ] User Management link (no manage_users permission)
- [ ] Role Management link (no manage_roles permission)
- [ ] Create User button (no create_users permission)

### 3.2 Properties Page (if exists)

On the properties listing page:

**Should Be Visible:**
- [ ] List of properties
- [ ] View details button/link
- [ ] Edit button (has edit_properties)

**Should Be Hidden:**
- [ ] Delete button (no delete_properties permission)
- [ ] Create new property button (no create_properties permission)

### 3.3 Inspect DOM

Use browser inspector to verify hidden elements are actually removed:

- [ ] Right-click on page, select "Inspect"
- [ ] Search for admin-only elements
- [ ] ✅ Elements should not exist in DOM (not just `display: none`)

---

## Test Suite 4: Permission Service

### 4.1 Console Testing

Run these in console:
```javascript
// Check if functions are available
window.checkPermission('edit_properties');  // Should return true
window.checkPermission('delete_properties'); // Should return false
window.checkPermission('create_users');      // Should return false

window.checkRole('owner');  // Should return true
window.checkRole('admin');  // Should return false
window.checkRole('pm');     // Should return false

window.listPermissions();   // Should show all 8 permissions
```

**Expected Results:**
- [ ] `checkPermission('edit_properties')` returns `true`
- [ ] `checkPermission('delete_properties')` returns `false`
- [ ] `checkRole('owner')` returns `true`
- [ ] `checkRole('admin')` returns `false`

---

## Test Suite 5: Admin User Testing

### 5.1 Set Admin Password

First, set password for admin user:

```bash
docker-compose exec db mysql -u root -p"root_password" propertifi -e "UPDATE users SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@propertifi.com'"
```

Password will be: `password`

### 5.2 Login as Admin

- [ ] Logout current user
- [ ] Login with:
  - Email: `admin@propertifi.com`
  - Password: `password`
- [ ] ✅ Login successful

### 5.3 Verify Admin Permissions

Check console:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Permission count:', user.permissions.length);
```

- [ ] Admin has exactly 26 permissions
- [ ] All permission categories are present

### 5.4 Test Admin Access

Navigate to admin routes:

- [ ] `/admin` - Should load successfully
- [ ] `/users` - Should load successfully
- [ ] `/roles` - Should load successfully
- [ ] `/properties/create` - Should load successfully

**All routes should work for admin**

### 5.5 Test Admin UI

Check navigation menu:

- [ ] All menu items are visible
- [ ] Admin Panel link is visible
- [ ] User Management link is visible
- [ ] All action buttons are visible

---

## Test Suite 6: Property Manager Testing

### 6.1 Set PM Password

```bash
docker-compose exec db mysql -u root -p"root_password" propertifi -e "UPDATE users SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'john@smithpm.com'"
```

Password will be: `password`

### 6.2 Login as Property Manager

- [ ] Logout current user
- [ ] Login with john@smithpm.com / password
- [ ] ✅ Login successful

### 6.3 Verify PM Permissions

- [ ] Has exactly 12 permissions
- [ ] Has property management permissions
- [ ] Has lead management permissions
- [ ] Does NOT have user management permissions

### 6.4 Test PM Access

**Should Work:**
- [ ] `/properties` - Can view
- [ ] `/properties/create` - Can create (has create_properties)
- [ ] `/leads` - Can view and manage
- [ ] `/analytics` - Can view

**Should Not Work:**
- [ ] `/admin` - Redirects to unauthorized
- [ ] `/users` - Redirects to unauthorized
- [ ] `/properties/delete/:id` - No delete permission

---

## Test Suite 7: Edge Cases

### 7.1 Logout and Re-login

- [ ] Logout
- [ ] LocalStorage cleared
- [ ] Redux store reset to initial state
- [ ] Login again
- [ ] Permissions loaded correctly

### 7.2 Token in Headers

Check Network tab for any API request:

- [ ] Headers include `Authorization: Bearer <token>`
- [ ] Token matches localStorage token

### 7.3 Refresh Page

- [ ] While logged in, refresh page (F5)
- [ ] User remains authenticated
- [ ] Permissions still present
- [ ] UI renders correctly

### 7.4 Direct URL Access

- [ ] Copy URL of protected page
- [ ] Logout
- [ ] Paste URL in browser
- [ ] Should redirect to login with `returnUrl` parameter
- [ ] After login, should redirect back to original URL

---

## Test Suite 8: Directive Testing

### 8.1 `*appHasPermission` Directive

Find an element using this directive:

```html
<button *appHasPermission="'edit_properties'">Edit</button>
```

- [ ] Element is visible for users with permission
- [ ] Element is removed from DOM for users without permission
- [ ] Works with array of permissions
- [ ] Works with `mode: 'any'` option

### 8.2 `*appHasRole` Directive

Find an element using this directive:

```html
<div *appHasRole="'admin'">Admin Panel</div>
```

- [ ] Element visible only for matching role
- [ ] Hidden for other roles
- [ ] Works with array of roles

---

## Issues Found

Document any issues discovered during testing:

### Issue #1
- **Description**:
- **Steps to Reproduce**:
- **Expected**:
- **Actual**:
- **Severity**: Critical / High / Medium / Low
- **Status**: Open / Fixed

### Issue #2
...

---

## Test Results Summary

### Owner User Tests
- Login: ⏳ Pending / ✅ Pass / ❌ Fail
- Permissions Count: ⏳ Pending / ✅ Pass / ❌ Fail
- Route Guards: ⏳ Pending / ✅ Pass / ❌ Fail
- UI Directives: ⏳ Pending / ✅ Pass / ❌ Fail

### Admin User Tests
- Login: ⏳ Pending / ✅ Pass / ❌ Fail
- Permissions Count: ⏳ Pending / ✅ Pass / ❌ Fail
- Full Access: ⏳ Pending / ✅ Pass / ❌ Fail

### Property Manager Tests
- Login: ⏳ Pending / ✅ Pass / ❌ Fail
- Permissions Count: ⏳ Pending / ✅ Pass / ❌ Fail
- Limited Access: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Sign-Off

- **Tested By**: ___________________
- **Date**: ___________________
- **Overall Status**: ✅ All Pass / ⚠️ Issues Found / ❌ Failed
- **Ready for Next Phase**: Yes / No

**Notes**:
