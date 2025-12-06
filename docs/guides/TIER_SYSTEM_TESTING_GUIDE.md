# Tiered Lead Assignment System - End-to-End Testing Guide

## Overview

This guide walks you through testing the complete tiered lead assignment system to verify:
- Premium tier users (Premium/Enterprise) get leads immediately
- Free tier users get leads after the exclusivity period
- Notifications are queued and sent correctly
- Database timestamps are set properly

## Test Users Created

Three test PM users have been created with different tier subscriptions:

| Email | Password | Tier | Exclusivity | Lead Cap |
|-------|----------|------|-------------|----------|
| `pm-free@test.com` | `password123` | Free | 0 hours | 3/month |
| `pm-premium@test.com` | `password123` | Premium | 24 hours | 30/month |
| `pm-enterprise@test.com` | `password123` | Enterprise | 48 hours | 100/month |

All users are configured to:
- Service Phoenix, AZ area (33.4484, -112.0740)
- Accept all property types (single-family, multi-family, commercial)
- Service radius: 50 miles
- Units: 1-100

## Pre-Test Setup

### 1. Start the Queue Worker

The queue worker is ESSENTIAL for delayed notifications to work.

```bash
cd propertifi-backend
./start-queue-worker.sh
```

Keep this running in a separate terminal window. You should see:
```
=========================================
Starting Propertifi Queue Worker
=========================================
[timestamp] Processing: ...
```

### 2. Verify Backend is Running

```bash
# Should return 200
curl http://localhost:8000/api/states
```

### 3. Start Frontend (if testing UI)

```bash
cd propertifi-frontend/nextjs-app
npm run dev
```

## Test Scenario 1: Submit Lead Matching All Tiers

### Step 1: Submit a Test Lead

Submit a lead in the Phoenix, AZ area that matches all three tiers:

```bash
curl -X POST http://localhost:8000/api/home-page-lead \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Property Owner",
    "email": "owner@test.com",
    "phone": "555-1234",
    "street_address": "100 Test Street",
    "city": "Phoenix",
    "state": "AZ",
    "zip_code": "85001",
    "property_type": "multi-family",
    "number_of_units": 12,
    "square_footage": 5000,
    "additional_services": ["maintenance", "leasing"],
    "preferred_contact": "email",
    "source": "test"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Your request has been submitted successfully",
  "lead_id": X,
  "data": {
    "matched_managers_count": 3,
    "assignments": [...]
  }
}
```

### Step 2: Check Lead Assignments in Database

```bash
php artisan tinker --execute="
\$lead = DB::table('leads')->latest()->first();
echo 'Lead ID: ' . \$lead->id . PHP_EOL;
echo 'Lead: ' . \$lead->property_type . ' at ' . \$lead->city . ', ' . \$lead->state . PHP_EOL . PHP_EOL;

\$assignments = DB::table('lead_assignments')
    ->join('users', 'lead_assignments.manager_id', '=', 'users.id')
    ->leftJoin('user_preferences', 'users.id', '=', 'user_preferences.user_id')
    ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
    ->where('lead_assignments.lead_id', \$lead->id)
    ->select(
        'lead_assignments.id',
        'users.name as manager',
        'users.email',
        'tiers.name as tier',
        'lead_assignments.match_score',
        'lead_assignments.distance_miles',
        'lead_assignments.available_at',
        'lead_assignments.status'
    )
    ->get();

echo 'Assignments:' . PHP_EOL;
foreach (\$assignments as \$a) {
    \$now = now();
    \$available = \$a->available_at ? \Carbon\Carbon::parse(\$a->available_at) : null;
    \$status = \$available && \$available->isPast() ? 'AVAILABLE NOW' : (\$available ? 'DELAYED ' . \$available->diffForHumans(\$now) : 'IMMEDIATE');
    echo sprintf('  ID:%d | %-20s | %-12s | Score:%d%% | %s' . PHP_EOL,
        \$a->id, \$a->manager, \$a->tier, \$a->match_score, \$status);
}
"
```

Expected output:
```
Lead ID: X
Lead: multi-family at Phoenix, AZ

Assignments:
  ID:1 | Enterprise Tier PM   | enterprise   | Score:XX% | AVAILABLE NOW
  ID:2 | Premium Tier PM      | premium      | Score:XX% | AVAILABLE NOW
  ID:3 | Free Tier PM         | free         | Score:XX% | DELAYED in 48 hours
```

### Step 3: Check Notifications Table

```bash
php artisan tinker --execute="
\$notifications = DB::table('notifications')
    ->latest()
    ->limit(5)
    ->get();

echo 'Recent Notifications:' . PHP_EOL;
foreach (\$notifications as \$n) {
    \$data = json_decode(\$n->data);
    echo sprintf('  %s | %s | Read: %s' . PHP_EOL,
        \$n->notifiable_id,
        \$data->title ?? 'N/A',
        \$n->read_at ? 'Yes' : 'No');
}
"
```

Expected: Premium and Enterprise users should have notifications. Free user should NOT (it's queued).

### Step 4: Check Jobs Queue

```bash
php artisan tinker --execute="
echo 'Pending Jobs: ' . DB::table('jobs')->count() . PHP_EOL;
echo 'Failed Jobs: ' . DB::table('failed_jobs')->count() . PHP_EOL;

\$jobs = DB::table('jobs')->get();
foreach (\$jobs as \$job) {
    echo '  Job ID: ' . \$job->id . ' | Queue: ' . \$job->queue . ' | Available at: ' . date('Y-m-d H:i:s', \$job->available_at) . PHP_EOL;
}
"
```

Expected: Should show 1 queued job for the free tier notification (if using delay).

## Test Scenario 2: Login and Verify UI

### Test Premium/Enterprise Users

1. Login at `http://localhost:3000/login`
   - Email: `pm-premium@test.com`
   - Password: `password123`

2. Navigate to "Leads" page

3. **Expected Results**:
   - ✅ Should see the lead IMMEDIATELY
   - ✅ Lead card shows match score and distance
   - ✅ Dashboard header shows "Premium" badge
   - ✅ NO upgrade banner (premium user)

### Test Free Tier User

1. Logout and login again
   - Email: `pm-free@test.com`
   - Password: `password123`

2. Navigate to "Leads" page

3. **Expected Results**:
   - ❌ Should NOT see the lead yet (available_at is in the future)
   - ✅ Should see upgrade banner with "You missed X leads"
   - ✅ Dashboard header shows "Free Tier" badge

## Test Scenario 3: Quick Test with Reduced Exclusivity

For testing without waiting 24-48 hours, temporarily reduce exclusivity:

```bash
# Set premium exclusivity to 1 minute
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 0.0166]);
DB::table('tiers')->where('name', 'enterprise')->update(['exclusivity_hours' => 0.033]);
echo 'Exclusivity reduced: Premium=1min, Enterprise=2min' . PHP_EOL;
"
```

Then submit a lead and wait 2 minutes. The free tier user should then see it.

**Reset when done**:
```bash
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 24]);
DB::table('tiers')->where('name', 'enterprise')->update(['exclusivity_hours' => 48]);
echo 'Exclusivity reset to normal' . PHP_EOL;
"
```

## Test Scenario 4: Queue Worker Processing

### Manual Queue Processing (for testing)

```bash
# Process exactly one job
php artisan queue:work --once

# Process all jobs
php artisan queue:work --stop-when-empty
```

### Expected Behavior

When the queue worker processes the delayed notification job:
1. Free tier user receives email notification
2. Database notification is created for free tier user
3. Job is removed from `jobs` table
4. Free tier user can now see the lead in their dashboard

## Verification Checklist

- [ ] Test users created with different tiers
- [ ] Queue worker is running
- [ ] Lead submitted successfully
- [ ] Database shows correct `available_at` timestamps
  - Premium/Enterprise: `available_at = now()`
  - Free: `available_at = now() + 48 hours`
- [ ] Premium/Enterprise users see lead immediately
- [ ] Free user does NOT see lead (filtered by `available_at`)
- [ ] Notifications sent to Premium/Enterprise immediately
- [ ] Notification queued for Free user
- [ ] Queue worker processes delayed notification
- [ ] Free user sees lead after exclusivity period

## Troubleshooting

### Lead not showing for Premium users
- Check `available_at` in database - should be in the past
- Verify tier assignment: `SELECT * FROM user_preferences WHERE user_id = X`
- Check frontend API call: `/api/pm/leads` should filter by `available_at <= now()`

### Free user sees lead immediately
- Check tier assignment - might be NULL (defaults to free/immediate)
- Verify `available_at` timestamp in `lead_assignments` table
- Check if premium users exist - if no premium matches, free gets immediate access

### Notifications not being sent
- Ensure queue worker is running
- Check `jobs` table for queued jobs
- Check `failed_jobs` table for errors
- Verify `QUEUE_CONNECTION=database` in `.env`
- Check logs: `tail -f storage/logs/laravel.log`

### Queue worker not processing jobs
- Restart queue worker: `php artisan queue:restart`
- Check database connection
- Verify jobs exist: `SELECT * FROM jobs;`

## Success Criteria

✅ **Tiered system is working correctly when**:
1. Premium tier users get leads 24h before free tier
2. Enterprise tier users get leads 48h before free tier
3. If only free tier matches exist, they get immediate access
4. Notifications are sent immediately to premium, queued for free
5. Queue worker successfully processes delayed notifications
6. Frontend correctly filters leads by `available_at` timestamp

## Cleanup After Testing

```bash
# Delete test lead assignments
php artisan tinker --execute="
DB::table('lead_assignments')->where('lead_id', '>=', X)->delete();
DB::table('leads')->where('id', '>=', X)->delete();
echo 'Test data cleaned up' . PHP_EOL;
"

# Clear jobs queue
php artisan queue:clear database

# Reset tier exclusivity if changed
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 24]);
DB::table('tiers')->where('name', 'enterprise')->update(['exclusivity_hours' => 48]);
"
```
