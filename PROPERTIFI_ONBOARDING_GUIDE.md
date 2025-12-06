# Propertifi - Comprehensive Onboarding Guide

Welcome to the Propertifi project! This guide provides a complete overview of the project architecture, file structure, and development workflows to help you get started quickly and effectively.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Directory & File Structure](#3-directory--file-structure)
4. [Key Features & Business Logic](#4-key-features--business-logic)
5. [Technology Stack](#5-technology-stack)
6. [Setup & Installation](#6-setup--installation)
7. [Testing Guide](#7-testing-guide)
8. [Development Workflow](#8-development-workflow)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Project Overview

**Propertifi** is a SaaS platform designed to connect property owners with property managers through an intelligent matching and lead distribution system.

### Core Value Proposition

- **For Property Owners:** Submit property management requests and get matched with qualified property managers in your area
- **For Property Managers:** Receive qualified leads based on your service area, property type preferences, and subscription tier
- **For Admins:** Monitor lead distribution, user activity, and system performance

### Key Differentiator: Tiered Lead Assignment System

The platform implements a **tiered subscription model** where premium-tier property managers get early, exclusive access to leads:

- **Enterprise Tier**: 48-hour exclusive access to leads
- **Premium Tier**: 24-hour exclusive access to leads
- **Free Tier**: Access to leads after premium exclusivity period expires

---

## 2. Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  Next.js        │◄───────►│  Laravel API     │◄───────►│  MySQL          │
│  Frontend       │  HTTP   │  Backend         │  SQL    │  Database       │
│  (Port 3000)    │         │  (Port 8000)     │         │                 │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  Queue Worker    │
                            │  (Background)    │
                            │  Jobs            │
                            └──────────────────┘
```

### Backend (Laravel)

- **Location:** `propertifi-backend/`
- **Function:** RESTful API providing all business logic, authentication, and data management
- **API Versioning:** `/api/v2/*` (v2 is current, active version)
- **Key Responsibilities:**
  - User authentication (Sanctum)
  - Lead matching algorithm
  - Tiered lead assignment
  - Notifications (queued)
  - Geocoding services

### Frontend (Next.js)

- **Location:** `propertifi-frontend/nextjs-app/`
- **Function:** Modern, server-rendered React application with role-based dashboards
- **Router:** Next.js App Router (file-based routing)
- **State Management:** Zustand (auth), React Query (data fetching)
- **Key Features:**
  - Dual login system (Owner/PM)
  - Role-based dashboards
  - Real-time notifications (WebSocket)
  - Responsive UI with Tailwind CSS

### Database (MySQL)

- **Key Tables:**
  - `users` - All user accounts (owners, PMs, admins)
  - `leads` - Property management requests
  - `lead_assignments` - Junction table connecting leads to PMs with match scores
  - `user_preferences` - PM service area, property types, subscription tier
  - `tiers` - Subscription tier definitions (free, premium, enterprise)
  - `notifications` - User notifications

---

## 3. Directory & File Structure

### Backend Structure (`propertifi-backend/`)

```
propertifi-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── LeadController.php          ⭐ CRITICAL - Lead assignment logic
│   │           ├── OwnerDashboardController.php
│   │           ├── PmDashboardController.php
│   │           └── NotificationController.php
│   ├── Models/
│   │   ├── Lead.php
│   │   ├── LeadAssignment.php                  ⭐ Core model for tiered system
│   │   ├── LeadView.php
│   │   └── User.php
│   ├── Notifications/
│   │   └── LeadMatchedNotification.php         ⭐ Queueable notification
│   └── Services/
│       └── GeocodingService.php                ⭐ Google Maps API integration
├── database/
│   └── migrations/
│       ├── *_create_lead_assignments_table.php ⭐ Tiered assignment schema
│       ├── *_add_available_at_to_lead_assignments.php ⭐ Tier timing
│       └── *_create_notifications_table.php
├── routes/
│   └── api.php                                 ⭐ All API endpoints defined here
├── config/
│   └── cors.php                                ⭐ CORS configuration for frontend
├── .env                                        ⭐ Environment variables (DO NOT COMMIT)
├── setup-test-tier-users.php                   🧪 Test data script
├── create-admin-user.php                       🧪 Admin setup script
└── start-queue-worker.sh                       🚀 Queue worker startup script
```

#### Key Backend Files Explained

| File | Purpose | Why It's Important |
|------|---------|-------------------|
| `LeadController.php` | Handles lead submission, geocoding, PM matching, and tiered assignment | **MOST CRITICAL FILE** - Contains `assignMatchingManagers()` method |
| `LeadAssignment.php` | Model with `available_at` timestamp for tier-based access control | Core to tiered system functionality |
| `LeadMatchedNotification.php` | Sends notifications to PMs (immediate or delayed based on tier) | Implements `ShouldQueue` interface |
| `GeocodingService.php` | Converts addresses to lat/lng coordinates using Google Maps API | Required for distance-based matching |
| `api.php` | Route definitions for all API endpoints | Single source of truth for API structure |

### Frontend Structure (`propertifi-frontend/nextjs-app/`)

```
nextjs-app/
├── app/
│   ├── (auth)/                                 📁 Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                            📁 Dashboard route group
│   │   ├── owner/                              👤 Property Owner dashboard
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── leads/
│   │   │   └── settings/
│   │   ├── property-manager/                   👤 Property Manager dashboard
│   │   │   ├── page.tsx                        ⭐ Shows tier badge
│   │   │   ├── layout.tsx                      ⭐ WebSocket integration
│   │   │   ├── leads/
│   │   │   │   └── page.tsx                    ⭐ Filtered by available_at
│   │   │   └── preferences/
│   │   │       └── page.tsx                    ⭐ Tier selection
│   │   └── admin/                              👤 Admin dashboard
│   │       ├── page.tsx
│   │       ├── lead-assignments/
│   │       │   └── page.tsx                    ⭐ Tiered assignment monitoring
│   │       ├── users/
│   │       └── settings/
│   ├── (marketing)/                            📁 Public marketing pages
│   │   └── home/
│   │       └── page.tsx
│   └── page.tsx                                🏠 Landing page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── leads/
│   │   └── LeadCardEnhanced.tsx                ⭐ Shows match score & distance
│   ├── owner/
│   │   └── DashboardStats.tsx
│   ├── pm/
│   │   └── UpgradeBanner.tsx                   ⭐ Free tier upgrade prompt
│   ├── layout/
│   │   ├── AdminLayout.tsx
│   │   └── AdminSidebar.tsx                    ⭐ Admin navigation
│   └── providers/
│       └── WebSocketProvider.tsx               🔌 Real-time notifications
├── lib/
│   ├── api.ts                                  🔧 Base API client
│   ├── auth-api.ts                             🔧 Authentication endpoints
│   ├── owner-api.ts                            🔧 Owner endpoints
│   ├── leads-api.ts                            🔧 Lead endpoints
│   └── notifications-api.ts                    🔧 Notification endpoints
├── hooks/
│   └── useAuth.ts                              ⭐ Zustand auth store with localStorage
├── types/
│   ├── auth.ts
│   ├── owner.ts
│   └── leads.ts                                ⭐ LeadWithAssignment type
├── .env.local                                  ⭐ Environment variables (DO NOT COMMIT)
└── package.json
```

#### Key Frontend Files Explained

| File | Purpose | Why It's Important |
|------|---------|-------------------|
| `useAuth.ts` | Global authentication state using Zustand with localStorage persistence | Single source of truth for auth across app |
| `property-manager/leads/page.tsx` | PM leads dashboard with tiered filtering | Filters by `available_at <= now()` |
| `admin/lead-assignments/page.tsx` | Admin view of all lead assignments with tier info | Monitors tiered system performance |
| `LeadCardEnhanced.tsx` | Lead card component showing match score and distance | Enhanced UX for PMs |
| `UpgradeBanner.tsx` | Conversion component for free tier users | Drives subscription upgrades |
| `owner-api.ts` | Owner-specific API calls | **Fixed hydration issue** by unwrapping Laravel response |

---

## 4. Key Features & Business Logic

### A. Tiered Lead Assignment System ⭐

**This is the core differentiator of Propertifi.**

#### How It Works

1. **Lead Submission** (Owner → Frontend → Backend)
   - Owner submits property details via form
   - Frontend calls `POST /api/home-page-lead`

2. **Geocoding** (Backend)
   - `GeocodingService` converts address to coordinates
   - Coordinates stored in `leads` table

3. **PM Matching** (Backend - `LeadController::assignMatchingManagers()`)
   ```php
   // Pseudocode of the matching algorithm
   foreach (property_managers as $pm) {
       // 1. Distance check (Haversine formula)
       if (distance > service_radius) continue;

       // 2. Property type match
       if (!in_array(lead_property_type, pm_property_types)) continue;

       // 3. Unit range check
       if (lead_units < min_units OR lead_units > max_units) continue;

       // 4. Calculate match score (0-100)
       match_score = calculate_score(distance, property_type, units);

       // 5. Add to matches
       matches[] = ['pm' => $pm, 'score' => match_score];
   }
   ```

4. **Tier-Based Assignment** (Backend)
   ```php
   // Separate matches by tier
   $premiumMatches = matches where tier IN ['premium', 'enterprise'];
   $freeMatches = matches where tier = 'free';

   // Premium gets immediate access
   foreach ($premiumMatches as $match) {
       LeadAssignment::create([
           'available_at' => now(),  // Immediate
           // ...
       ]);
       // Send immediate notification
       $pm->notify(new LeadMatchedNotification($lead));
   }

   // Free gets delayed access
   $delay = max(premium_tiers)->exclusivity_hours; // 24h or 48h
   foreach ($freeMatches as $match) {
       LeadAssignment::create([
           'available_at' => now()->addHours($delay),  // Delayed
           // ...
       ]);
       // Queue delayed notification
       $pm->notify((new LeadMatchedNotification($lead))
           ->delay(now()->addHours($delay)));
   }
   ```

5. **Queue Processing** (Queue Worker)
   - Laravel queue worker processes delayed jobs
   - When `available_at` time is reached, notification is sent
   - Free tier PM can now see lead in their dashboard

6. **Frontend Filtering** (Next.js)
   ```typescript
   // PM leads are filtered by available_at
   const query = LeadAssignment::where('manager_id', $pm->id)
       ->where(function ($q) {
           $q->whereNull('available_at')
             ->orWhere('available_at', '<=', now());
       });
   ```

#### Match Score Calculation

The match score (0-100) is calculated based on:

- **Property Type Match** (25 points): Exact match gives full points
- **Unit Range Match** (25 points): Lead units within PM's range
- **Distance** (50 points): Closer = higher score
  - Within 10 miles: 50 points
  - 10-25 miles: 35 points
  - 25-40 miles: 20 points
  - 40-50 miles: 10 points

### B. Dual Login System

Users can register/login as either:
- **Property Owner** (`type = 'owner'`)
- **Property Manager** (`type = 'pm'`)

The frontend detects user type from the auth token and redirects accordingly:
```typescript
if (user.type === 'owner') {
  router.push('/owner');
} else if (user.type === 'pm') {
  router.push('/property-manager');
}
```

### C. Real-Time Notifications

- **Backend**: Laravel notifications stored in `notifications` table
- **Frontend**: WebSocket connection for real-time updates
- **Component**: `WebSocketProvider` wraps PM dashboard
- **Display**: NotificationBell component shows unread count

### D. Admin Monitoring Dashboard

Admins can monitor:
- Total lead assignments
- Premium tier distribution
- Average match scores
- Availability status (immediate vs delayed)
- Filter by tier, status, search

---

## 5. Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | 8.1+ | Server-side language |
| Laravel | 10.x | API framework |
| MySQL | 8.0+ | Database |
| Sanctum | - | API authentication |
| Google Maps API | - | Geocoding |
| Laravel Queue | - | Background job processing |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Zustand | 4.x | State management (auth) |
| React Query | 5.x | Data fetching & caching |
| Framer Motion | - | Animations |
| Heroicons | - | Icon library |

### DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Git | Version control |

---

## 6. Setup & Installation

### Prerequisites

- **Docker & Docker Compose** (recommended)
- OR:
  - PHP 8.1+
  - Composer
  - Node.js 18+
  - npm or yarn
  - MySQL 8.0+

### Option A: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd propertifi
   ```

2. **Backend Setup**
   ```bash
   cd propertifi-backend
   cp .env.example .env
   # Edit .env with your configuration
   docker-compose up -d
   docker-compose exec app composer install
   docker-compose exec app php artisan key:generate
   docker-compose exec app php artisan migrate --seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../propertifi-frontend/nextjs-app
   cp .env.local.example .env.local
   # Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
   npm install
   npm run dev
   ```

4. **Start Queue Worker** ⚠️ CRITICAL
   ```bash
   cd ../../propertifi-backend
   docker-compose exec app php artisan queue:work
   # Keep this running in a separate terminal
   ```

### Option B: Local Setup (Without Docker)

1. **Backend Setup**
   ```bash
   cd propertifi-backend
   composer install
   cp .env.example .env
   # Configure database in .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve  # Runs on http://localhost:8000
   ```

2. **Frontend Setup**
   ```bash
   cd propertifi-frontend/nextjs-app
   npm install
   cp .env.local.example .env.local
   # Set NEXT_PUBLIC_API_URL=http://localhost:8000
   npm run dev  # Runs on http://localhost:3000
   ```

3. **Start Queue Worker** ⚠️ CRITICAL
   ```bash
   # In a new terminal
   cd propertifi-backend
   php artisan queue:work
   ```

### Environment Variables

#### Backend (.env)

```env
APP_NAME=Propertifi
APP_ENV=local
APP_KEY=                          # Generated by php artisan key:generate
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=propertifi
DB_USERNAME=root
DB_PASSWORD=

QUEUE_CONNECTION=database         # ⚠️ CRITICAL for tiered system
GOOGLE_MAPS_API_KEY=              # Required for geocoding

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### Initial Test Data Setup

Run these scripts to set up test users:

```bash
cd propertifi-backend

# Create admin user
php create-admin-user.php
# Creates: admin@propertifi.com / admin123

# Create test PM users with different tiers
php setup-test-tier-users.php
# Creates:
#   pm-free@test.com / password123 (Free tier)
#   pm-premium@test.com / password123 (Premium tier - 24h exclusivity)
#   pm-enterprise@test.com / password123 (Enterprise tier - 48h exclusivity)
```

---

## 7. Testing Guide

### Quick Access to Testing Documentation

- 📖 **[Tier System Testing Guide](./TIER_SYSTEM_TESTING_GUIDE.md)** - End-to-end testing of tiered lead assignment
- 📖 **[Admin Dashboard Testing Guide](./ADMIN_DASHBOARD_TESTING_GUIDE.md)** - Testing admin monitoring features

### End-to-End Test Scenario

This validates the core tiered lead assignment system.

#### Prerequisites
- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:3000`
- ✅ **Queue worker running** (critical!)
- ✅ Test users created (run `setup-test-tier-users.php`)

#### Test Steps

**1. Submit a Test Lead**

```bash
curl -X POST http://localhost:8000/api/home-page-lead \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Owner",
    "email": "owner@test.com",
    "phone": "555-1234",
    "street_address": "100 Test Street",
    "city": "Phoenix",
    "state": "AZ",
    "zip_code": "85001",
    "property_type": "multi-family",
    "number_of_units": 12,
    "preferred_contact": "email"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Your request has been submitted successfully",
  "lead_id": 1,
  "data": {
    "matched_managers_count": 3,
    "assignments": [...]
  }
}
```

**2. Verify Database Assignments**

```bash
cd propertifi-backend
php artisan tinker --execute="
DB::table('lead_assignments')
    ->join('users', 'lead_assignments.manager_id', '=', 'users.id')
    ->leftJoin('user_preferences', 'users.id', '=', 'user_preferences.user_id')
    ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
    ->where('lead_id', 1)
    ->select('users.name', 'tiers.name as tier', 'lead_assignments.available_at')
    ->get()
    ->each(function(\$a) {
        echo \$a->name . ' | ' . \$a->tier . ' | ' . \$a->available_at . PHP_EOL;
    });
"
```

Expected output:
```
Enterprise Tier PM | enterprise | 2025-11-24 10:00:00  (immediate)
Premium Tier PM    | premium    | 2025-11-24 10:00:00  (immediate)
Free Tier PM       | free       | 2025-11-26 10:00:00  (48h later)
```

**3. Test Premium Access (Frontend)**

- Navigate to http://localhost:3000/login
- Login as `pm-premium@test.com` / `password123`
- Go to "Leads" page
- ✅ **EXPECT**: See the newly submitted lead immediately
- ✅ **EXPECT**: See match score and distance on lead card
- ✅ **EXPECT**: Dashboard header shows "Premium" tier badge

**4. Test Free Tier Access (Frontend)**

- Logout
- Login as `pm-free@test.com` / `password123`
- Go to "Leads" page
- ❌ **EXPECT**: Do NOT see the lead (available_at is in the future)
- ✅ **EXPECT**: See upgrade banner at top of page
- ✅ **EXPECT**: Dashboard header shows "Free Tier" badge

**5. Test Admin Monitoring**

- Logout
- Login as `admin@propertifi.com` / `admin123`
- Click "Lead Assignments" in sidebar
- ✅ **EXPECT**: See all 3 assignments in the table
- ✅ **EXPECT**: Premium/Enterprise show "Available now" (green)
- ✅ **EXPECT**: Free shows "Available in 48h" (amber)
- ✅ **EXPECT**: Filter by tier works correctly
- ✅ **EXPECT**: Stats cards show correct counts

**6. Test Delayed Access (Optional - Fast Test)**

To test without waiting 48 hours:

```bash
# Temporarily reduce exclusivity to 1 minute
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 0.0166]);
DB::table('tiers')->where('name', 'enterprise')->update(['exclusivity_hours' => 0.033]);
echo 'Exclusivity reduced: Premium=1min, Enterprise=2min' . PHP_EOL;
"

# Submit a new lead (use curl from step 1)
# Wait 2 minutes
# Check free tier dashboard - lead should now appear

# Reset exclusivity
php artisan tinker --execute="
DB::table('tiers')->where('name', 'premium')->update(['exclusivity_hours' => 24]);
DB::table('tiers')->where('name', 'enterprise')->update(['exclusivity_hours' => 48]);
echo 'Exclusivity reset to normal' . PHP_EOL;
"
```

### Unit Testing

```bash
# Backend tests
cd propertifi-backend
./vendor/bin/phpunit

# Frontend tests
cd propertifi-frontend/nextjs-app
npm test
```

### E2E Testing (Playwright)

```bash
cd propertifi-frontend/nextjs-app
npm run test:e2e
```

For detailed E2E test documentation, see:
- `propertifi-frontend/nextjs-app/e2e/README.md`
- `propertifi-frontend/nextjs-app/e2e/QUICK_START.md`

---

## 8. Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Code Style

**Backend (PHP):**
- Follow PSR-12 coding standard
- Use Laravel conventions
- Run `php artisan test` before committing

**Frontend (TypeScript/React):**
- Use ESLint and Prettier
- Follow React best practices
- Run `npm run lint` before committing

### Database Migrations

**Creating a new migration:**
```bash
php artisan make:migration create_table_name --create=table_name
# or
php artisan make:migration add_column_to_table --table=table_name
```

**Running migrations:**
```bash
php artisan migrate
```

**Rolling back:**
```bash
php artisan migrate:rollback
```

### API Development

**Adding a new endpoint:**

1. Define route in `routes/api.php`:
```php
Route::get('/api/v2/endpoint', [Controller::class, 'method']);
```

2. Create controller method:
```php
public function method(Request $request)
{
    return response()->json(['data' => ...]);
}
```

3. Add frontend API function in `lib/*-api.ts`:
```typescript
export const getData = async (): Promise<DataType> => {
  const response = await apiClient.get('/api/v2/endpoint');
  return response.data;
};
```

### Queue Jobs

**Running the queue worker:**
```bash
# Development
php artisan queue:work

# Production (with supervisor)
php artisan queue:work --queue=default --sleep=3 --tries=3
```

**Monitoring queued jobs:**
```bash
# Check pending jobs
php artisan queue:work --once

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

---

## 9. Troubleshooting

### Common Issues

#### 1. Queue Worker Not Processing Jobs

**Symptom:** Free tier users never receive lead notifications

**Solution:**
```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# Restart queue worker
php artisan queue:restart
php artisan queue:work
```

#### 2. Hydration Mismatch Errors (Frontend)

**Symptom:** React hydration errors in browser console

**Cause:** `useAuth` hook uses localStorage which isn't available during SSR

**Solution:** Already fixed in layouts - they use `isMounted` state to prevent rendering until client-side

#### 3. CORS Errors

**Symptom:** API calls blocked by browser CORS policy

**Solution:**
Check `propertifi-backend/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

#### 4. 401 Unauthorized on API Calls

**Symptom:** All API calls return 401

**Causes:**
- Token expired
- Token not included in request
- CORS credentials not enabled

**Solution:**
```typescript
// Ensure apiClient includes credentials
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

#### 5. Geocoding Fails

**Symptom:** Leads submitted but no matches found

**Cause:** Missing or invalid Google Maps API key

**Solution:**
1. Get API key from Google Cloud Console
2. Enable Geocoding API
3. Add to `.env`: `GOOGLE_MAPS_API_KEY=your-key-here`
4. Restart Laravel: `php artisan config:clear`

#### 6. Database Connection Refused

**Symptom:** `SQLSTATE[HY000] [2002] Connection refused`

**Solution:**
```bash
# Check MySQL is running
docker-compose ps
# or
sudo service mysql status

# Check .env database credentials
DB_HOST=127.0.0.1  # Use 127.0.0.1, not localhost
DB_PORT=3306
DB_DATABASE=propertifi
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Debug Mode

**Backend:**
```env
# .env
APP_DEBUG=true
LOG_LEVEL=debug
```

**Frontend:**
```typescript
// Add to components for debugging
console.log('Debug:', { variable });
```

### Getting Help

1. Check existing documentation in `/docs`
2. Review testing guides:
   - `TIER_SYSTEM_TESTING_GUIDE.md`
   - `ADMIN_DASHBOARD_TESTING_GUIDE.md`
3. Check Laravel logs: `propertifi-backend/storage/logs/laravel.log`
4. Check browser console for frontend errors
5. Review `OBSOLETE_FILES.md` to ensure you're not referencing outdated files

---

## Additional Resources

### Documentation Files

- **[Project Status & Roadmap](./docs/PROJECT_STATUS_AND_ROADMAP.md)** - Current status and future plans
- **[Documentation Audit Report](./docs/DOCUMENTATION_AUDIT_REPORT.md)** - Historical documentation review
- **[Obsolete Files](./OBSOLETE_FILES.md)** - Files that should be archived/ignored

### External Links

- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand](https://github.com/pmndrs/zustand)

---

## Quick Reference

### Important Commands

```bash
# Backend
php artisan serve                 # Start backend server
php artisan queue:work            # Start queue worker (CRITICAL!)
php artisan migrate               # Run migrations
php artisan tinker               # Interactive REPL

# Frontend
npm run dev                      # Start dev server
npm run build                    # Production build
npm run lint                     # Run linter

# Docker
docker-compose up -d             # Start all services
docker-compose down              # Stop all services
docker-compose exec app bash     # SSH into backend container
```

### Test User Credentials

| Email | Password | Role | Tier |
|-------|----------|------|------|
| `admin@propertifi.com` | `admin123` | Admin | N/A |
| `pm-free@test.com` | `password123` | Property Manager | Free |
| `pm-premium@test.com` | `password123` | Property Manager | Premium (24h) |
| `pm-enterprise@test.com` | `password123` | Property Manager | Enterprise (48h) |

### Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Owner Dashboard | http://localhost:3000/owner |
| PM Dashboard | http://localhost:3000/property-manager |
| Admin Dashboard | http://localhost:3000/admin |
| API Docs | http://localhost:8000/api/documentation |

---

**Last Updated:** November 24, 2025
**Version:** 1.0.0
**Maintained By:** Development Team

Welcome aboard! 🚀
