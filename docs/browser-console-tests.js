/**
 * Browser Console Testing Script for RBAC
 *
 * Copy and paste these commands in the browser console (F12)
 * when the Angular app is running to test RBAC functionality
 */

// ========================================
// 1. CHECK AUTH STATE
// ========================================

console.log('=== AUTH STATE TESTS ===');

// Get auth token
console.log('Token:', localStorage.getItem('auth_token'));

// Get user data
const user = JSON.parse(localStorage.getItem('user') || 'null');
console.log('User:', user);

// Show permissions
console.log('Permissions:', user?.permissions);
console.log('Permission count:', user?.permissions?.length || 0);
console.log('User type:', user?.type);
console.log('User role_id:', user?.role_id);

// ========================================
// 2. EXPECTED PERMISSIONS PER ROLE
// ========================================

const expectedPermissions = {
  admin: 26,
  pm: 12,
  owner: 8
};

console.log('\n=== PERMISSION VALIDATION ===');
if (user) {
  const expected = expectedPermissions[user.type];
  const actual = user.permissions?.length || 0;

  if (actual === expected) {
    console.log(`✅ PASS: User has correct number of permissions (${actual}/${expected})`);
  } else {
    console.error(`❌ FAIL: Expected ${expected} permissions, got ${actual}`);
  }

  console.log('Permissions list:', user.permissions);
}

// ========================================
// 3. PERMISSION SPECIFIC CHECKS
// ========================================

console.log('\n=== SPECIFIC PERMISSION CHECKS ===');

const testPermissions = {
  owner: [
    'view_properties',    // Should have
    'edit_properties',    // Should have
    'delete_properties',  // Should NOT have
    'create_users',       // Should NOT have
    'view_analytics',     // Should have
  ],
  pm: [
    'view_properties',     // Should have
    'create_properties',   // Should have
    'delete_properties',   // Should NOT have
    'manage_properties',   // Should have
    'assign_leads',        // Should have
  ],
  admin: [
    'view_users',          // Should have
    'create_users',        // Should have
    'delete_users',        // Should have
    'manage_system_settings', // Should have
  ]
};

if (user && testPermissions[user.type]) {
  testPermissions[user.type].forEach(perm => {
    const hasPermission = user.permissions?.includes(perm);
    const shouldHave = perm.startsWith('view_') ||
                       perm.startsWith('edit_') ||
                       perm === 'create_properties' ||
                       perm === 'assign_leads' ||
                       perm === 'manage_properties' ||
                       (user.type === 'admin'); // admin has all

    const status = hasPermission ? '✅' : '❌';
    console.log(`${status} ${perm}: ${hasPermission ? 'HAS' : 'MISSING'}`);
  });
}

// ========================================
// 4. TEST PERMISSION SERVICE (if accessible)
// ========================================

console.log('\n=== PERMISSION SERVICE TESTS ===');
console.log('Note: These tests require access to Angular components.');
console.log('If you see errors, the service is not accessible from console.');
console.log('You can test these manually in the UI instead.');

// ========================================
// 5. VERIFY REDUX STORE (if DevTools installed)
// ========================================

console.log('\n=== REDUX STORE CHECK ===');
console.log('Open Redux DevTools to inspect state.auth');
console.log('Expected structure:');
console.log({
  user: {
    id: 'number',
    name: 'string',
    email: 'string',
    type: 'admin|pm|owner',
    permissions: 'string[]'
  },
  token: 'string',
  isAuthenticated: 'boolean',
  isLoading: 'boolean',
  error: 'string|null'
});

// ========================================
// 6. NETWORK REQUEST INSPECTION
// ========================================

console.log('\n=== NETWORK INSPECTION GUIDE ===');
console.log('1. Open Network tab');
console.log('2. Look for these requests:');
console.log('   - POST /api/v2/auth/login');
console.log('   - GET /api/v2/auth/user');
console.log('3. Check request headers for: Authorization: Bearer <token>');
console.log('4. Check response contains user.permissions array');

// ========================================
// 7. ROUTE GUARD TEST URLS
// ========================================

console.log('\n=== ROUTE GUARD TESTING ===');
console.log('Try navigating to these URLs to test guards:');

const testRoutes = {
  'Public': [
    '/',
    '/auth/login',
  ],
  'Authenticated': [
    '/dashboard',
  ],
  'Admin Only': [
    '/admin',
    '/users',
    '/roles',
  ],
  'Permission Required': [
    '/properties/create', // requires create_properties
    '/users/edit',        // requires edit_users
  ]
};

Object.entries(testRoutes).forEach(([category, routes]) => {
  console.log(`\n${category}:`);
  routes.forEach(route => {
    console.log(`  ${route}`);
  });
});

console.log('\nExpected Behavior:');
console.log('- ✅ Allowed routes: Load successfully');
console.log('- ❌ Blocked routes: Redirect to /unauthorized');
console.log('- 🔒 Auth required: Redirect to /auth/login?returnUrl=<url>');

// ========================================
// 8. PERMISSION DISCREPANCY CHECKER
// ========================================

console.log('\n=== PERMISSION DISCREPANCY CHECK ===');

const rolePermissions = {
  admin: [
    'view_users', 'create_users', 'edit_users', 'delete_users', 'manage_users',
    'view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'manage_roles',
    'view_properties', 'create_properties', 'edit_properties', 'delete_properties', 'manage_properties',
    'view_leads', 'create_leads', 'edit_leads', 'delete_leads', 'assign_leads', 'manage_leads',
    'view_analytics', 'view_reports', 'export_reports',
    'manage_settings', 'manage_system_settings',
    'view_billing', 'manage_billing', 'view_invoices',
    'view_support_tickets', 'manage_support_tickets',
    'view_marketplace', 'manage_marketplace'
  ],
  pm: [
    'view_properties', 'create_properties', 'edit_properties', 'manage_properties',
    'view_leads', 'create_leads', 'edit_leads', 'assign_leads',
    'view_analytics', 'view_reports',
    'view_support_tickets',
    'view_marketplace'
  ],
  owner: [
    'view_properties', 'edit_properties',
    'view_analytics', 'view_reports',
    'view_billing', 'view_invoices',
    'view_support_tickets',
    'view_marketplace'
  ]
};

if (user && rolePermissions[user.type]) {
  const expected = rolePermissions[user.type];
  const actual = user.permissions || [];

  const missing = expected.filter(p => !actual.includes(p));
  const extra = actual.filter(p => !expected.includes(p));

  if (missing.length === 0 && extra.length === 0) {
    console.log('✅ PERFECT: All permissions match exactly');
  } else {
    if (missing.length > 0) {
      console.error('❌ MISSING PERMISSIONS:', missing);
    }
    if (extra.length > 0) {
      console.warn('⚠️  EXTRA PERMISSIONS:', extra);
    }
  }
}

// ========================================
// 9. QUICK PERMISSION CHECK FUNCTION
// ========================================

console.log('\n=== UTILITY FUNCTIONS ===');

window.checkPermission = function(permission) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const hasIt = user?.permissions?.includes(permission);
  console.log(`Permission "${permission}": ${hasIt ? '✅ YES' : '❌ NO'}`);
  return hasIt;
};

window.listPermissions = function() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('All user permissions:', user?.permissions);
  return user?.permissions || [];
};

window.checkRole = function(role) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const hasIt = user?.type === role;
  console.log(`Role "${role}": ${hasIt ? '✅ YES' : '❌ NO'}`);
  return hasIt;
};

console.log('\nYou can now use these functions:');
console.log('  checkPermission("edit_users")');
console.log('  listPermissions()');
console.log('  checkRole("admin")');

// ========================================
// 10. FINAL SUMMARY
// ========================================

console.log('\n=== TEST SUMMARY ===');
if (user) {
  console.log(`User: ${user.name} (${user.email})`);
  console.log(`Type: ${user.type}`);
  console.log(`Permissions: ${user.permissions?.length || 0}`);
  console.log(`Expected: ${expectedPermissions[user.type] || 'Unknown'}`);

  const match = user.permissions?.length === expectedPermissions[user.type];
  console.log(`Status: ${match ? '✅ PASS' : '❌ FAIL'}`);
} else {
  console.log('❌ No user logged in');
  console.log('Please log in first to test RBAC');
}

console.log('\n=== DONE ===');
console.log('Review the output above for any issues.');
console.log('Use the utility functions to check specific permissions.');
