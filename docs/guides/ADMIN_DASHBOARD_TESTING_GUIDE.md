# SaaS Admin Dashboard - Testing Guide

## Admin User Credentials

An admin user has been created for testing the admin dashboard:

```
Email:    admin@propertifi.com
Password: admin123
```

## Accessing the Admin Dashboard

### 1. Start the Application

**Backend:**
```bash
cd propertifi-backend
php artisan serve
# Or if using Docker: docker-compose up -d
```

**Frontend:**
```bash
cd propertifi-frontend/nextjs-app
npm run dev
```

### 2. Login as Admin

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `admin@propertifi.com`
   - Password: `admin123`
3. Click "Sign In"

**Expected:** You should be redirected to the admin dashboard

### 3. Admin Routes

After login, you can access these admin pages:

| Page | URL | Description |
|------|-----|-------------|
| **Main Dashboard** | `/admin` | Overview stats and analytics |
| **Lead Assignments** | `/admin/lead-assignments` | **NEW!** Tiered lead assignment monitoring |
| **Users** | `/admin/users` | User management |
| **Leads** | `/admin/leads` | All submitted leads |
| **Property Managers** | `/admin/property-managers` | PM management |
| **Roles** | `/admin/roles` | Role management |
| **Settings** | `/admin/settings` | System settings |

## Testing the Lead Assignments Dashboard

The new **Lead Assignments** page (`/admin/lead-assignments`) is specifically designed for monitoring the tiered lead assignment system.

### Features to Test:

#### 1. Stats Cards (Top Row)

Check that these KPIs display correctly:

- **Total Assignments**: Count of all lead assignments
- **Premium Tier**: Count of Pro + Enterprise assignments
- **Avg Match Score**: Average match percentage across all assignments
- **Available Now**: How many assignments are currently accessible (not delayed)

**Test:**
```bash
# Submit a test lead first
curl -X POST http://localhost:8000/api/home-page-lead \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Admin Test Owner",
    "email": "admintest@test.com",
    "phone": "555-9999",
    "street_address": "200 Admin Blvd",
    "city": "Phoenix",
    "state": "AZ",
    "zip_code": "85001",
    "property_type": "multi-family",
    "number_of_units": 20,
    "preferred_contact": "email"
  }'
```

Refresh the admin dashboard - stats should update.

#### 2. Filter Controls

Test the filtering functionality:

**Search Bar:**
- Type a manager name (e.g., "Free Tier PM")
- Type a city name (e.g., "Phoenix")
- Type an address

**Tier Filter:**
- Select "All Tiers" (default)
- Select "Free" - should show only free tier assignments
- Select "Premium" - should show only premium tier
- Select "Enterprise" - should show only enterprise tier

**Status Filter:**
- Select "All Status" (default)
- Select "Pending" - should filter to pending assignments
- Select "Contacted"
- Select "Accepted"
- Select "Declined"

#### 3. Assignments Table

Verify the table displays all columns correctly:

| Column | What to Check |
|--------|---------------|
| **Lead** | Property type, address, city/state |
| **Manager** | Manager name and ID |
| **Tier** | Color-coded badge (Free=gray, Basic=blue, Pro=purple, Enterprise=amber) |
| **Match** | Match score percentage with color coding (green 80%+, blue 60%+, yellow 40%+) |
| **Distance** | Miles away from manager's service area |
| **Available At** | Timestamp + status ("Available now" or "Available in Xh") |
| **Status** | Assignment status badge |

#### 4. Tier Badge Colors

Verify the tier badges have the correct colors:

- **Free**: Gray background, gray text
- **Basic**: Blue background, blue text
- **Pro**: Purple background, purple text
- **Enterprise**: Amber background, amber text

#### 5. Available At Column

This is the KEY column for testing tiered access:

**For Premium/Enterprise assignments:**
- Should show current timestamp
- Should display "Available now" in green text

**For Free tier assignments (when premium users match):**
- Should show future timestamp (now + 48h)
- Should display "Available in 48h" in amber text

**Test Query:**
```bash
php artisan tinker --execute="
\$assignments = DB::table('lead_assignments')
    ->join('users', 'lead_assignments.manager_id', '=', 'users.id')
    ->leftJoin('user_preferences', 'users.id', '=', 'user_preferences.user_id')
    ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
    ->select(
        'lead_assignments.id',
        'users.name',
        'tiers.name as tier',
        'lead_assignments.available_at',
        DB::raw('CASE WHEN lead_assignments.available_at <= NOW() THEN \"AVAILABLE\" ELSE \"DELAYED\" END as status')
    )
    ->orderBy('lead_assignments.created_at', 'desc')
    ->limit(10)
    ->get();

foreach (\$assignments as \$a) {
    echo sprintf('%-20s | %-12s | %-19s | %s' . PHP_EOL,
        \$a->name, \$a->tier, \$a->available_at, \$a->status);
}
"
```

## Backend API Testing

The admin dashboard uses a frontend route, but you can also test the backend API directly.

### Create Backend Admin Lead Assignments Endpoint

Currently, the admin lead assignments page uses mock data. To make it functional, we need to create a backend API endpoint.

**Test manually via database:**
```bash
php artisan tinker --execute="
// Get all lead assignments with tier info
\$assignments = DB::table('lead_assignments')
    ->join('users', 'lead_assignments.manager_id', '=', 'users.id')
    ->join('leads', 'lead_assignments.lead_id', '=', 'leads.id')
    ->leftJoin('user_preferences', 'users.id', '=', 'user_preferences.user_id')
    ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
    ->select(
        'lead_assignments.id',
        'lead_assignments.lead_id',
        'lead_assignments.manager_id',
        'users.name as manager_name',
        'users.email as manager_email',
        'tiers.name as manager_tier',
        'leads.address as lead_address',
        'leads.city as lead_city',
        'leads.state as lead_state',
        'leads.property_type',
        'lead_assignments.match_score',
        'lead_assignments.distance_miles',
        'lead_assignments.status',
        'lead_assignments.available_at',
        'lead_assignments.created_at'
    )
    ->orderBy('lead_assignments.created_at', 'desc')
    ->limit(20)
    ->get();

echo json_encode(\$assignments, JSON_PRETTY_PRINT);
"
```

## Test Scenarios

### Scenario 1: Verify Tier Distribution

**Goal:** Confirm that premium and free tier users get different `available_at` times.

**Steps:**
1. Submit a lead (use curl command above)
2. Check admin dashboard `/admin/lead-assignments`
3. Look at the "Available At" column

**Expected:**
- Enterprise & Premium: "Available now"
- Free: "Available in 48h"

### Scenario 2: Filter by Tier

**Goal:** Test tier filtering works correctly.

**Steps:**
1. Go to `/admin/lead-assignments`
2. Click the "Tier" dropdown
3. Select "Premium"
4. Verify only Premium tier assignments show
5. Select "Free"
6. Verify only Free tier assignments show

### Scenario 3: Search Functionality

**Goal:** Test search across manager names and addresses.

**Steps:**
1. Type "Free Tier PM" in search box
2. Should filter to show only that manager's assignments
3. Clear and type "Phoenix"
4. Should show all leads in Phoenix

### Scenario 4: Monitor Queue Processing

**Goal:** Watch assignments become available over time.

**Steps:**
1. Submit a lead with reduced exclusivity (1 min for testing)
2. Free tier shows "Available in 1m"
3. Wait 1 minute
4. Refresh page
5. Free tier should now show "Available now"

**Quick test setup:**
```bash
# Reduce exclusivity
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 0.0166]);
"

# Submit lead
# ... use curl

# Wait 1 minute

# Refresh admin dashboard
```

## Admin Dashboard Stats Verification

### Total Assignments
```sql
SELECT COUNT(*) FROM lead_assignments;
```

### Premium Tier Count
```sql
SELECT COUNT(*)
FROM lead_assignments la
JOIN user_preferences up ON la.manager_id = up.user_id
JOIN tiers t ON up.tier_id = t.id
WHERE t.name IN ('premium', 'enterprise');
```

### Average Match Score
```sql
SELECT AVG(match_score) FROM lead_assignments;
```

### Available Now Count
```sql
SELECT COUNT(*)
FROM lead_assignments
WHERE available_at IS NULL OR available_at <= NOW();
```

## Troubleshooting

### "No data" showing in admin dashboard

**Problem:** The page shows "No assignments found"

**Solutions:**
1. Submit a test lead first (see curl command above)
2. Check database: `SELECT * FROM lead_assignments;`
3. Verify mock data is loading in the frontend component

### Tier badges not showing

**Problem:** "No tier" displays instead of tier name

**Solutions:**
1. Check user_preferences has tier_id set
2. Verify tiers table exists and has data
3. Check the join query in the component

### Available_at not showing correctly

**Problem:** All assignments show "Available now"

**Solutions:**
1. Check `available_at` column in database
2. Verify exclusivity_hours in tiers table
3. Ensure lead submission logic sets `available_at` correctly

### Admin can't access pages

**Problem:** 403 Forbidden or redirected to login

**Solutions:**
1. Verify user type is 'admin': `SELECT type FROM users WHERE email = 'admin@propertifi.com';`
2. Check middleware is checking for admin type
3. Clear session and login again

## Next Steps

After testing the admin dashboard:

1. **Create Backend API Endpoint** (if needed):
   - Add route in `routes/api.php`: `Route::get('/admin/lead-assignments', ...)`
   - Create controller method to return real data
   - Update frontend to fetch from API instead of mock data

2. **Add More Admin Features**:
   - Override `available_at` for testing
   - Bulk actions on assignments
   - Export assignments to CSV
   - Real-time updates with polling

3. **Add Analytics**:
   - Conversion rates by tier
   - Response time by tier
   - Revenue metrics

## Summary

✅ **Admin dashboard tests:**
- Login as admin
- View lead assignments with tier information
- Filter by tier and status
- Search by manager/location
- Verify `available_at` timestamps
- Monitor tier distribution stats

🎯 **Key validation points:**
- Premium/Enterprise get immediate access (`available_at = now()`)
- Free tier gets delayed access (`available_at = now() + 48h`)
- Stats cards show accurate counts
- Filtering and search work correctly
- Tier badges have correct colors
