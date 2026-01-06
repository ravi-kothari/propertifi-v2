# Backend Permissions Update

This document describes the changes made to return user permissions in authentication responses.

## Overview

The backend now returns a `permissions` array in the user object for all authentication endpoints. This enables fine-grained permission-based access control in the frontend.

## Changes Made

### 1. User Model Updates

**File**: `app/Models/User.php`

- Added `permissions` to the `$appends` array to automatically include it in JSON responses
- Created `getPermissionsAttribute()` accessor method that:
  - Returns all available permissions for admin and AccountManager users
  - Returns role-based permissions from the `roles` table for other users
  - Automatically loads the role relationship if needed

### 2. Auth Controller Updates

**File**: `app/Http/Controllers/Api/V2/AuthController.php`

Updated three endpoints to include permissions:

1. **POST `/api/v2/auth/register`** - Registration endpoint
2. **POST `/api/v2/auth/login`** - Login endpoint
3. **GET `/api/v2/auth/user`** - Get authenticated user endpoint

All three endpoints now:
- Load the user's role relationship with `$user->load('role')`
- Include `permissions` in the user response object

### 3. Default Roles Seeder

**File**: `database/seeders/DefaultRolesSeeder.php`

Created a comprehensive seeder that populates default roles with permissions:

**Roles Created**:
- **Admin** - Full system access with all permissions
- **Property Manager** - Property and lead management
- **Property Owner** - View and manage own properties
- **User** - Basic user with limited permissions
- **Account Manager** - User and customer relation management

**Available Permissions**:

```php
// User Management
'view_users', 'create_users', 'edit_users', 'delete_users', 'manage_users'

// Role Management
'view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'manage_roles'

// Property Management
'view_properties', 'create_properties', 'edit_properties', 'delete_properties', 'manage_properties'

// Lead Management
'view_leads', 'create_leads', 'edit_leads', 'delete_leads', 'assign_leads', 'manage_leads'

// Analytics & Reports
'view_analytics', 'view_reports', 'export_reports'

// Settings
'manage_settings', 'manage_system_settings'

// Billing
'view_billing', 'manage_billing', 'view_invoices'

// Support
'view_support_tickets', 'manage_support_tickets'

// Marketplace
'view_marketplace', 'manage_marketplace'
```

## API Response Format

### Login/Register Response

```json
{
  "access_token": "1|xyz...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "type": "owner",
    "permissions": [
      "view_properties",
      "edit_properties",
      "view_analytics",
      "view_reports",
      "view_billing",
      "view_invoices",
      "view_support_tickets",
      "view_marketplace"
    ],
    "email_verified_at": "2025-01-01T00:00:00.000000Z",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### Get User Response

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "type": "owner",
  "permissions": [
    "view_properties",
    "edit_properties",
    "view_analytics",
    "view_reports"
  ],
  "email_verified_at": "2025-01-01T00:00:00.000000Z",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

## Database Setup

### Running the Seeder

To populate default roles with permissions:

```bash
# Run only the DefaultRolesSeeder
php artisan db:seed --class=DefaultRolesSeeder

# Or run all seeders
php artisan db:seed
```

### Assigning Roles to Users

To assign a role to a user:

```php
use App\Models\User;
use App\Models\Roles;

$user = User::find(1);
$role = Roles::where('name', 'owner')->first();
$user->role_id = $role->id;
$user->save();
```

## Permission Checking in Backend

The User model already has built-in permission checking methods:

```php
// Check single permission
if ($user->hasPermission('edit_users')) {
    // User has permission
}

// Check if user has any of the permissions
if ($user->hasAnyPermission(['edit_users', 'view_users'])) {
    // User has at least one permission
}

// Check if user has all permissions
if ($user->hasAllPermissions(['edit_users', 'view_users'])) {
    // User has all permissions
}
```

## Special Cases

### Admin and AccountManager Users

These user types automatically receive all available permissions, regardless of their assigned role. This is handled in the `getPermissionsAttribute()` method.

### Users Without Roles

If a user has no assigned role (`role_id` is null), the permissions array will be empty `[]`.

## Frontend Integration

The Angular frontend can now:

1. Access the `permissions` array from the user object in NgRx store
2. Use permission guards to protect routes
3. Use permission directives to conditionally show/hide UI elements
4. Make programmatic permission checks using the PermissionService

See `angular-app/docs/RBAC_IMPLEMENTATION.md` for frontend implementation details.

## Migration Notes

If you have existing users:

1. Run the DefaultRolesSeeder to create roles with permissions
2. Assign appropriate roles to existing users based on their `type` field:
   ```sql
   UPDATE users
   SET role_id = (SELECT id FROM roles WHERE name = 'owner')
   WHERE type = 'owner' AND role_id IS NULL;

   UPDATE users
   SET role_id = (SELECT id FROM roles WHERE name = 'property_manager')
   WHERE type = 'pm' AND role_id IS NULL;

   UPDATE users
   SET role_id = (SELECT id FROM roles WHERE name = 'admin')
   WHERE type = 'admin' AND role_id IS NULL;
   ```

## Testing

Test the endpoints:

```bash
# Register a new user
curl -X POST http://localhost:8000/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get authenticated user
curl -X GET http://localhost:8000/api/v2/auth/user \
  -H "Authorization: Bearer {your-token-here}"
```

All responses should include the `permissions` array in the user object.

## Troubleshooting

### Permissions Array is Empty

1. Check if the user has a `role_id` assigned
2. Check if the role exists in the `roles` table
3. Check if the role has permissions in the `permissions` JSON field
4. Run the DefaultRolesSeeder if needed

### Role Relationship Not Loading

The `$user->load('role')` call is already included in all auth controller methods. If permissions are still not showing, check:

1. The `roles` table exists
2. The foreign key relationship is correct
3. Database migrations have been run

## Future Enhancements

Potential improvements:

1. Create an admin interface for managing roles and permissions
2. Add permission middleware for route protection
3. Implement permission caching for better performance
4. Add audit logging for permission changes
5. Create a permission sync command for updating role permissions
