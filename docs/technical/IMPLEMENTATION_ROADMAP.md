# Propertifi SEO Landing Pages: Technical Implementation Roadmap

**Date:** November 28, 2025
**Status:** Technical Specification
**Category:** Technical
**Author:** Gemini AI

---

## Executive Summary

This document provides a detailed technical implementation plan for the Propertifi SEO-Optimized Landing Pages and Property Manager (PM) Marketplace. It is based on the UX Design Specification and the provided property manager data.

The plan covers a phased implementation roadmap, a detailed lead-matching algorithm, database schema migrations, API specifications, and the frontend component architecture required for development. The goal is to provide a clear and actionable guide for the engineering team to build the platform without ambiguity.

---

## 1. Implementation Roadmap

The project is broken down into four distinct phases. This approach allows for iterative development, testing, and deployment.

### Phase 1: Foundation & Data Ingestion (2-3 Weeks)

**Goal:** Set up the core infrastructure, database, and ingest the initial property manager data.

- **Backend (Laravel):**
    - **Database Setup:** Define and run migrations for all required tables (see Section 3).
    - **Models:** Create Eloquent models for `PropertyManager`, `Location`, `ServiceType`, `Lead`, etc.
    - **Data Ingestion Script:** Create an Artisan command (`php artisan import:managers`) to parse the `property_managers_CA_FL_DC.json` file, geocode addresses to get latitude/longitude, and populate the `property_managers`, `locations`, and `service_types` tables.
- **Frontend (Next.js):**
    - **Project Scaffolding:** Set up the Next.js App Router directory structure.
    - **Styling:** Configure Tailwind CSS with the project's design tokens (colors, fonts).
    - **Core Layout:** Create the main `layout.tsx` with the shared `Header` and `Footer` components.
- **DevOps:**
    - Configure local development environments (Docker).
    - Set up a staging environment for deployments.

**Estimated Effort:** 80-120 hours

**Key Deliverables:**
- Migrations for all core tables
- Data import script with geocoding
- Basic Next.js project structure
- Docker development environment

**Dependencies:**
- Google Maps Geocoding API key
- Laravel backend setup complete
- Next.js 16.0+ installed

---

### Phase 2: SEO Landing Pages (State & City) (3-4 Weeks)

**Goal:** Build the static, SEO-critical state and city landing pages.

- **Backend (Laravel):**
    - **API Endpoints:** Develop API endpoints to provide aggregated data for states and cities (e.g., list of cities with PM counts, featured PMs per state). See `GET /api/locations/*` in Section 4.
    - **Performance Optimization:** Implement caching for these aggregate endpoints.
- **Frontend (Next.js):**
    - **State Page:** Create the dynamic route `/[state]/page.tsx`. Fetch and display state-specific data, city grid, and educational content. This page should be statically generated (SSG).
    - **City Page:** Create the dynamic route `/[state]/[city]/page.tsx`. Implement the PM list, filter/sort functionality, and local market guide. This page should also be statically generated with fallback or ISR for new cities.
    - **Components:** Build the `PMCard`, `FilterBar`, `CityGrid`, and `FAQ` components (see Section 5).

**Estimated Effort:** 120-160 hours

**Key Deliverables:**
- State landing pages for CA and FL
- City landing pages for all 32 cities
- Filtering and sorting functionality
- SEO metadata and schema markup
- Sitemap generation

**Dependencies:**
- Phase 1 complete
- Property manager data imported
- API endpoints functional

---

### Phase 3: PM Profiles & Lead Submission (2-3 Weeks)

**Goal:** Develop the individual property manager profile pages and the lead capture form.

- **Backend (Laravel):**
    - **API Endpoints:**
        - Create the endpoint to fetch a single PM by slug (`GET /api/property-managers/{slug}`).
        - Create the lead submission endpoint (`POST /api/leads`) with validation.
- **Frontend (Next.js):**
    - **PM Profile Page:** Create the dynamic route `/[state]/[city]/[pm-slug]/page.tsx`. This page will fetch and display detailed information for a single property manager. It should use Incremental Static Regeneration (ISR) to handle updates.
    - **Lead Form:** Create the multi-step "Get Matched" wizard as a client-side component.
    - **Lead Submission Logic:** Implement the logic to post lead data to the backend API and handle the response (e.g., show the "Matching in Progress" UI).
    - **Comparison Tool:** Implement the UI for selecting and comparing up to 3 PMs.

**Estimated Effort:** 80-120 hours

**Key Deliverables:**
- 925 individual PM profile pages
- Multi-step lead submission wizard
- Lead validation and submission API
- Comparison tool functionality
- Success/confirmation pages

**Dependencies:**
- Phase 2 complete
- Geocoding service for lead addresses
- Email service configured for notifications

---

### Phase 4: Lead Matching & PM Dashboard (4-5 Weeks)

**Goal:** Implement the core business logic for lead matching and provide a dashboard for property managers to view and respond to leads.

- **Backend (Laravel):**
    - **Lead Matching Service:** Create a service class that implements the scoring algorithm from Section 2. When a lead is submitted, this service should find the best matches.
    - **Queue Jobs:** Use Laravel Queues to process lead matching asynchronously to avoid blocking the API response.
    - **Database:** Populate the `lead_matches` table with scores.
    - **PM Dashboard API:** Create authenticated endpoints for PMs to view their assigned leads, see match details, and respond.
    - **Tiered Access Logic:** Implement the logic for timed lead access based on the PM's subscription tier.
- **Frontend (Next.js):**
    - **PM Authentication:** Implement login/logout functionality for property managers.
    - **PM Dashboard:** Create a new section under `/dashboard` for authenticated PMs.
    - **Leads View:** Build the UI for the PM to see their list of new and active leads, including the `LeadCard` with match score visualization.
    - **Lead Response UI:** Develop the modal or page for PMs to respond to leads using templates.

**Estimated Effort:** 160-200 hours

**Key Deliverables:**
- Lead matching algorithm implementation
- Queue-based processing system
- PM authentication system
- PM dashboard with leads view
- Lead response functionality
- Tier-based access controls
- Email notifications for lead assignments

**Dependencies:**
- Phase 3 complete
- Queue service configured (Redis recommended)
- WebSocket/Pusher for real-time updates (optional)
- Payment integration for tier subscriptions

---

## 2. Lead Matching Algorithm

The lead matching algorithm calculates a score for each property manager (PM) based on a submitted lead. The total score is 100 points.

### Scoring Criteria & Weights

| Criteria | Max Points | Description |
| :--- | :--- | :--- |
| **Location Match** | 50 points | Based on the geographic distance between the property and the PM's office. |
| **Service Type Match** | 30 points | Based on the match between the owner's required services and the PM's offered services. |
| **Property Type Match** | 20 points | Based on the match between the property type (e.g., single-family, multi-family) and the PM's specialization. |

### Detailed Scoring Logic

#### A. Location Match (50 Points)

The score is calculated based on the straight-line distance from the lead's property coordinates (`lat`, `lng`) to the PM's office coordinates.

- **< 5 miles:** 50 points
- **5 - 10 miles:** 40 points
- **10 - 25 miles:** 25 points
- **25 - 40 miles:** 10 points
- **> 40 miles:** 0 points

**Implementation:** Requires geocoding all addresses (both leads and PMs) into latitude and longitude. Use the Haversine formula for distance calculation.

**Haversine Formula (PHP):**
```php
function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 3959; // miles

    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);

    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLon/2) * sin($dLon/2);

    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    $distance = $earthRadius * $c;

    return $distance;
}
```

#### B. Service Type Match (30 Points)

The lead will specify required services (e.g., 'Full Management', 'Leasing Only'). The PM's profile lists their offered services.

- **Perfect Match:** PM offers all requested services.
    - **Score: 30 points**
- **Partial Match:** PM offers some, but not all, requested services.
    - **Score: 15 points**
- **No Match:** PM offers none of the requested services.
    - **Score: 0 points**

**Example:**
- Lead needs: `Residential` and `HOA`.
- PM 1 offers: `Residential`, `Commercial`, `HOA`. **Score: 30**.
- PM 2 offers: `Residential`. **Score: 15**.
- PM 3 offers: `Commercial`. **Score: 0**.

#### C. Property Type Match (20 Points)

This score is based on how well the lead's property type aligns with the PM's `service_types` field.

- **Primary Specialty Match:** The lead's property type is explicitly listed as a primary specialty for the PM.
    - **Score: 20 points**
- **Secondary Match:** The PM manages the property type, but it's not a listed specialty.
    - **Score: 10 points**
- **No Match:** The PM does not manage the lead's property type.
    - **Score: 0 points**

**Example:**
- Lead Property: `Multi-Family`
- PM 1 (`service_types`: "Multi-Family, Residential"): **Score: 20**
- PM 2 (`service_types`: "Residential Single Family Homes"): **Score: 0**

### Final Score Calculation

`Total Score = Location Score + Service Type Score + Property Type Score`

A lead is considered a "match" and sent to a PM if their `Total Score` is **70 or higher**. The "Hot Match" designation is for scores **90 or higher**.

### Tier-Based Distribution Rules

| Tier | Lead Access | Response Window | Features |
|------|-------------|-----------------|----------|
| **Enterprise** | Immediate (0 hours) | 24 hours exclusive | Unlimited leads, priority ranking |
| **Premium** | Early (4 hours delay) | 48 hours | 50 leads/month, analytics |
| **Free** | Standard (24 hours delay) | 72 hours | 10 leads/month, basic features |

**Implementation Logic:**
```php
// When calculating available_at timestamp
$baseTime = now();

foreach ($matches as $match) {
    $pm = $match->propertyManager;

    switch ($pm->subscription_tier) {
        case 'enterprise':
            $availableAt = $baseTime;
            break;
        case 'premium':
            $availableAt = $baseTime->addHours(4);
            break;
        case 'free':
        default:
            $availableAt = $baseTime->addHours(24);
            break;
    }

    $match->available_at = $availableAt;
    $match->save();
}
```

### Example Scenarios

**Scenario 1: Perfect Match in San Diego**
```
Lead Details:
- Property: 123 Main St, San Diego, CA 92101
- Property Type: Multi-Family (12 units)
- Services Needed: Residential, Full Management

PM Details:
- Name: ABC Property Management
- Address: 456 Elm St, San Diego, CA 92101 (2.3 miles away)
- Service Types: Residential, Multi-Family, Commercial
- Tier: Premium

Scoring:
- Location: 50 points (< 5 miles)
- Service Type: 30 points (perfect match)
- Property Type: 20 points (specialty match)
- Total: 100 points (HOT MATCH)
- Available At: 4 hours after lead submission
```

**Scenario 2: Moderate Match in Los Angeles**
```
Lead Details:
- Property: 789 Oak Ave, Los Angeles, CA 90001
- Property Type: Single Family Home
- Services Needed: Residential, Leasing Only

PM Details:
- Name: XYZ Realty
- Address: 321 Pine St, Los Angeles, CA 90015 (8.5 miles away)
- Service Types: Residential, Commercial
- Tier: Free

Scoring:
- Location: 40 points (5-10 miles)
- Service Type: 15 points (partial - has Residential, not explicit Leasing)
- Property Type: 10 points (manages SFH but not specialty)
- Total: 65 points (Below threshold - NOT MATCHED)
```

---

## 3. Database Schema (SQL Migrations)

These migrations are designed for Laravel.

### Migration: `create_property_managers_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_managers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('address');
            $table->string('city', 100);
            $table->string('state', 50);
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('website')->nullable();
            $table->text('description')->nullable();
            $table->string('years_in_business')->nullable();
            $table->string('rentals_managed')->nullable();
            $table->string('bbb_rating', 10)->nullable();
            $table->integer('bbb_review_count')->default(0);
            $table->string('management_fee')->nullable();
            $table->string('tenant_placement_fee')->nullable();
            $table->string('lease_renewal_fee')->nullable();
            $table->text('miscellaneous_fees')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(true);
            $table->string('logo_url')->nullable();
            $table->enum('subscription_tier', ['free', 'premium', 'enterprise'])->default('free');
            $table->timestamps();

            // Indexes
            $table->index(['state', 'city']);
            $table->index('is_featured');
            $table->index('subscription_tier');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_managers');
    }
};
```

### Migration: `create_service_types_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "Residential", "Commercial", "HOA"
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // Pivot table
        Schema::create('property_manager_service_type', function (Blueprint $table) {
            $table->foreignId('property_manager_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_type_id')->constrained()->onDelete('cascade');
            $table->primary(['property_manager_id', 'service_type_id'], 'pm_service_type_primary');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_manager_service_type');
        Schema::dropIfExists('service_types');
    }
};
```

### Migration: `create_locations_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('city');
            $table->string('state');
            $table->string('slug')->unique(); // e.g., 'california-san-diego'
            $table->integer('property_manager_count')->default(0);
            $table->timestamps();

            $table->unique(['city', 'state']);
            $table->index('state');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
```

### Migration: `create_leads_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('owner_name');
            $table->string('owner_email');
            $table->string('owner_phone');
            $table->string('property_address');
            $table->string('property_city');
            $table->string('property_state');
            $table->string('property_zip')->nullable();
            $table->string('property_type'); // e.g., "Single-Family", "Multi-Family"
            $table->integer('property_units')->default(1);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('timeline'); // e.g., "Ready to hire", "Within 30 days"
            $table->text('notes')->nullable();
            $table->enum('status', ['new', 'matched', 'contacted', 'closed'])->default('new');
            $table->timestamps();

            $table->index(['property_city', 'property_state']);
            $table->index('status');
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
```

### Migration: `create_lead_matches_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_manager_id')->constrained()->onDelete('cascade');
            $table->integer('match_score');
            $table->json('score_breakdown'); // Store the details of the score calculation
            $table->timestamp('available_at'); // For tiered access
            $table->enum('status', ['pending', 'viewed', 'responded', 'won', 'lost'])->default('pending');
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->text('response_message')->nullable();
            $table->timestamps();

            $table->unique(['lead_id', 'property_manager_id']);
            $table->index('match_score');
            $table->index('status');
            $table->index('available_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_matches');
    }
};
```

---

## 4. API Specifications

All endpoints are prefixed with `/api`.

### Public Endpoints

#### `GET /api/locations/states`
**Description:** Retrieves a list of all states with property managers.

**Response:**
```json
{
  "data": [
    {
      "state": "California",
      "slug": "california",
      "manager_count": 705,
      "cities_count": 24
    },
    {
      "state": "Florida",
      "slug": "florida",
      "manager_count": 220,
      "cities_count": 8
    }
  ]
}
```

#### `GET /api/locations/states/{state_slug}/cities`
**Description:** Retrieves a list of cities for a given state.

**Path Params:**
- `state_slug` (string) - e.g., "california"

**Response:**
```json
{
  "data": [
    {
      "city": "San Diego",
      "slug": "san-diego",
      "state": "California",
      "manager_count": 52,
      "average_rating": "A+",
      "average_years": "15+"
    },
    {
      "city": "Los Angeles",
      "slug": "los-angeles",
      "state": "California",
      "manager_count": 51,
      "average_rating": "A",
      "average_years": "12+"
    }
  ],
  "meta": {
    "total_cities": 24,
    "total_managers": 705
  }
}
```

#### `GET /api/property-managers`
**Description:** Searches and filters property managers.

**Query Params:**
- `city` (string, required) - e.g., "San Diego"
- `state` (string, required) - e.g., "CA"
- `service_types[]` (array of strings) - e.g., ["Residential", "HOA"]
- `bbb_rating[]` (array of strings) - e.g., ["A+", "A"]
- `min_years` (integer) - Minimum years in business
- `has_pricing` (boolean) - Filter to only PMs with pricing info
- `sort` (string) - Options: `recommended`, `rating`, `experience`, `name`
- `page` (integer) - Page number for pagination
- `per_page` (integer) - Results per page (default: 20, max: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ABC Property Management",
      "slug": "abc-property-management",
      "city": "San Diego",
      "state": "CA",
      "address": "123 Main St, San Diego, CA 92101",
      "phone": "(619) 555-0100",
      "website": "https://abcpm.com",
      "bbb_rating": "A+",
      "years_in_business": "20+ years",
      "rentals_managed": "500+",
      "management_fee": "8% of monthly rent",
      "tenant_placement_fee": "One month's rent",
      "service_types": ["Residential", "Multi-Family", "Commercial"],
      "description": "Full-service property management with 20+ years of experience...",
      "is_featured": true,
      "is_verified": true,
      "logo_url": "https://cdn.propertifi.com/logos/abc-pm.png"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 52,
    "from": 1,
    "to": 20
  },
  "filters": {
    "available_service_types": [
      {"name": "Residential", "count": 48},
      {"name": "Commercial", "count": 22},
      {"name": "HOA", "count": 15}
    ],
    "available_ratings": [
      {"rating": "A+", "count": 35},
      {"rating": "A", "count": 10}
    ]
  }
}
```

#### `GET /api/property-managers/{slug}`
**Description:** Retrieves a single property manager by their unique slug.

**Path Params:**
- `slug` (string) - e.g., "abc-property-management"

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "ABC Property Management",
    "slug": "abc-property-management",
    "city": "San Diego",
    "state": "CA",
    "zip_code": "92101",
    "address": "123 Main St, San Diego, CA 92101",
    "latitude": 32.7157,
    "longitude": -117.1611,
    "phone": "(619) 555-0100",
    "website": "https://abcpm.com",
    "description": "ABC Property Management has been serving San Diego property owners for over 20 years. We specialize in residential, multi-family, and commercial property management with a focus on maximizing owner returns while maintaining high tenant satisfaction.",
    "years_in_business": "20+ years",
    "rentals_managed": "500+",
    "bbb_rating": "A+",
    "bbb_review_count": 127,
    "management_fee": "8% of monthly rent",
    "tenant_placement_fee": "One month's rent",
    "lease_renewal_fee": "$150",
    "miscellaneous_fees": "Eviction processing: $500",
    "service_types": ["Residential", "Multi-Family", "Commercial"],
    "is_featured": true,
    "is_verified": true,
    "logo_url": "https://cdn.propertifi.com/logos/abc-pm.png",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-11-28T10:00:00Z"
  },
  "similar_companies": [
    {
      "id": 2,
      "name": "XYZ Realty",
      "slug": "xyz-realty",
      "city": "San Diego",
      "bbb_rating": "A",
      "match_score": 85
    }
  ]
}
```

#### `POST /api/leads`
**Description:** Submits a new lead from a property owner.

**Request Body:**
```json
{
  "owner_name": "John Smith",
  "owner_email": "john.smith@example.com",
  "owner_phone": "555-123-4567",
  "property_address": "123 Main St, San Diego, CA 92101",
  "property_type": "Multi-Family",
  "property_units": 12,
  "timeline": "Within 30 days",
  "notes": "Looking for full-service management with tenant screening"
}
```

**Validation Rules:**
- `owner_name`: required, string, max:255
- `owner_email`: required, email
- `owner_phone`: required, string
- `property_address`: required, string
- `property_type`: required, in:Single-Family,Multi-Family,Condo,Townhome,Commercial
- `property_units`: required, integer, min:1
- `timeline`: required, in:Ready to hire,Within 30 days,Within 90 days,Just researching
- `notes`: nullable, string, max:1000

**Response (Success):**
```json
{
  "message": "Lead submitted successfully. We are finding the best matches for you.",
  "lead_id": 123,
  "matches_found": 8,
  "estimated_response_time": "24-48 hours"
}
```

**Response (Validation Error):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "owner_email": ["The owner email must be a valid email address."],
    "property_units": ["The property units must be at least 1."]
  }
}
```

### Authenticated PM Endpoints

All PM endpoints require Bearer token authentication.

#### `GET /api/pm/leads`
**Description:** Retrieves leads assigned to the authenticated property manager.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `status` (string) - Filter by status: `new`, `viewed`, `responded`
- `sort` (string) - Sort by: `match_score`, `submitted_at`, `available_at`
- `page` (integer)

**Response:**
```json
{
  "data": [
    {
      "id": 456,
      "lead_id": 123,
      "property_type": "Multi-Family",
      "property_units": 12,
      "location": "San Diego, CA 92101",
      "distance_miles": 2.3,
      "submitted_at": "2025-11-28T10:00:00Z",
      "available_at": "2025-11-28T14:00:00Z",
      "match_score": 94,
      "score_breakdown": {
        "location": 50,
        "service_type": 30,
        "property_type": 20
      },
      "status": "new",
      "is_hot_match": true,
      "timeline": "Within 30 days",
      "viewed_at": null,
      "responded_at": null
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 15,
    "unread_count": 8
  },
  "stats": {
    "total_leads_this_month": 42,
    "response_rate": 87,
    "average_match_score": 81
  }
}
```

#### `GET /api/pm/leads/{match_id}`
**Description:** Get full details for a specific lead match.

**Response:**
```json
{
  "data": {
    "id": 456,
    "lead_id": 123,
    "owner_name": "John Smith",
    "owner_email": "john.smith@example.com",
    "owner_phone": "555-123-4567",
    "property_address": "123 Main St, San Diego, CA 92101",
    "property_type": "Multi-Family",
    "property_units": 12,
    "timeline": "Within 30 days",
    "notes": "Looking for full-service management with tenant screening",
    "submitted_at": "2025-11-28T10:00:00Z",
    "match_score": 94,
    "score_breakdown": {
      "location": {
        "score": 50,
        "distance_miles": 2.3,
        "reason": "Within 5 miles of your office"
      },
      "service_type": {
        "score": 30,
        "reason": "Perfect match - you offer all requested services"
      },
      "property_type": {
        "score": 20,
        "reason": "Multi-Family is one of your specialties"
      }
    },
    "status": "viewed",
    "viewed_at": "2025-11-28T15:30:00Z"
  }
}
```

#### `POST /api/pm/leads/{match_id}/respond`
**Description:** Submit a response to a lead.

**Request Body:**
```json
{
  "message": "Thank you for your interest! I'd love to discuss managing your 12-unit property. With over 20 years of experience in multi-family management, we can help maximize your returns while maintaining high occupancy. I'll call you tomorrow at 10am to discuss details.",
  "preferred_contact_time": "2025-11-29T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Response submitted successfully.",
  "match_id": 456,
  "status": "responded",
  "responded_at": "2025-11-28T16:00:00Z"
}
```

---

## 5. Component Architecture (React/Next.js)

Components are organized by page type and reusability.

### Shared Components

#### `Header`
**Location:** `/components/layout/Header.tsx`
**Purpose:** Top navigation bar with search, auth status, and CTA

**Props:**
```typescript
interface HeaderProps {
  transparent?: boolean;
  fixed?: boolean;
}
```

**Features:**
- Responsive navigation with hamburger menu
- City/state search autocomplete
- "Get Matched" CTA button
- Login/Dashboard links (conditional based on auth)

#### `Footer`
**Location:** `/components/layout/Footer.tsx`
**Features:**
- Site links organized by category
- City directory (top 10 cities)
- Social media links
- Legal links (Privacy, Terms)

#### `PMCard`
**Location:** `/components/property-managers/PMCard.tsx`
**Purpose:** Displays property manager summary in lists

**Props:**
```typescript
interface PMCardProps {
  pm: PropertyManager;
  variant: 'compact' | 'detailed' | 'featured';
  showComparison?: boolean;
  onCompare?: (pm: PropertyManager) => void;
}
```

**Variants:**
- **compact:** Name, rating, phone, key stats (for mobile)
- **detailed:** Full card with pricing, description preview
- **featured:** Highlighted styling with badges

#### `TrustIndicatorBar`
**Location:** `/components/ui/TrustIndicatorBar.tsx`
**Purpose:** Displays trust badges

**Props:**
```typescript
interface TrustIndicatorBarProps {
  bbbRating?: string;
  isVerified: boolean;
  yearsInBusiness?: string;
  rentalsManaged?: string;
}
```

#### `FAQ`
**Location:** `/components/ui/FAQ.tsx`
**Purpose:** Accordion-style FAQ section

**Props:**
```typescript
interface FAQProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
  maxVisible?: number;
}
```

---

### State Page Components

#### `HeroState`
**Location:** `/components/landing/HeroState.tsx`

**Props:**
```typescript
interface HeroStateProps {
  state: string;
  managerCount: number;
  citiesCount: number;
}
```

**Features:**
- H1 with state name and manager count
- Key statistics bar
- City/zip search input
- Background image or gradient

#### `CityGrid`
**Location:** `/components/landing/CityGrid.tsx`

**Props:**
```typescript
interface CityGridProps {
  cities: Array<{
    name: string;
    slug: string;
    managerCount: number;
  }>;
  state: string;
}
```

**Features:**
- Responsive grid (1-col mobile, 3-col desktop)
- Sort options (alphabetical, by PM count)
- "View All Cities" expansion

#### `FeaturedManagersCarousel`
**Location:** `/components/landing/FeaturedManagersCarousel.tsx`

**Props:**
```typescript
interface FeaturedManagersCarouselProps {
  managers: PropertyManager[];
  state: string;
}
```

**Features:**
- Horizontal scroll on mobile
- 3-column grid on desktop
- Auto-rotation option

---

### City Page Components

#### `FilterBar`
**Location:** `/components/property-managers/FilterBar.tsx`

**Props:**
```typescript
interface FilterBarProps {
  filters: {
    serviceTypes: string[];
    bbbRatings: string[];
    minYears?: number;
    hasPricing?: boolean;
  };
  onFilterChange: (filters: Filters) => void;
  resultCount: number;
}
```

**Features:**
- Multi-select dropdowns for service types and ratings
- Clear filters button
- Live result count
- URL parameter sync

#### `PMList`
**Location:** `/components/property-managers/PMList.tsx`

**Props:**
```typescript
interface PMListProps {
  managers: PropertyManager[];
  loading?: boolean;
  onCompare?: (pm: PropertyManager) => void;
}
```

**Features:**
- Renders list of PMCard components
- Loading skeleton states
- Empty state messaging

#### `CompareTray`
**Location:** `/components/property-managers/CompareTray.tsx`

**State:**
```typescript
interface CompareTrayState {
  selectedPMs: PropertyManager[];
  isOpen: boolean;
}
```

**Features:**
- Sticky position at bottom of screen
- Shows selected PMs (max 3)
- Remove individual PMs
- "Compare Now" button

---

### PM Profile Page Components

#### `ProfileHero`
**Location:** `/components/property-managers/ProfileHero.tsx`

**Props:**
```typescript
interface ProfileHeroProps {
  pm: PropertyManager;
}
```

**Features:**
- Company logo
- H1 with company name
- BBB rating badge
- Key stats (years, units managed)
- Primary CTAs (Call, Website, Get Quote)

#### `ContactCard`
**Location:** `/components/property-managers/ContactCard.tsx`

**Props:**
```typescript
interface ContactCardProps {
  pm: PropertyManager;
  sticky?: boolean;
}
```

**Features:**
- Sticky sidebar on desktop
- Address with map link
- Phone with click-to-call
- Website link
- Business hours (if available)
- Contact form trigger

#### `PricingDetails`
**Location:** `/components/property-managers/PricingDetails.tsx`

**Props:**
```typescript
interface PricingDetailsProps {
  managementFee?: string;
  tenantPlacementFee?: string;
  leaseRenewalFee?: string;
  miscellaneousFees?: string;
  hasData: boolean;
}
```

**Features:**
- Displays all fees when available
- Shows market average context when missing
- "Contact for Pricing" CTA when no data
- Fee comparison tooltip

---

### Lead & Dashboard Components

#### `LeadWizard`
**Location:** `/components/leads/LeadWizard.tsx`

**Steps:**
1. Property Details (address, type, units)
2. Services Needed (checkboxes)
3. Timeline & Notes
4. Contact Information

**State:**
```typescript
interface LeadWizardState {
  currentStep: number;
  formData: LeadFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
}
```

#### `MatchProgress`
**Location:** `/components/leads/MatchProgress.tsx`

**Features:**
- Animated progress indicator
- Step-by-step visualization:
  1. Analyzing your property
  2. Searching 925 property managers
  3. Calculating match scores
  4. Finding top 10 matches
- Estimated completion time

#### `PMDashboardLayout`
**Location:** `/app/(dashboard)/pm/layout.tsx`

**Features:**
- Authenticated wrapper
- Sidebar navigation
- Stats overview header
- Notification bell

#### `LeadCard`
**Location:** `/components/dashboard/LeadCard.tsx`

**Props:**
```typescript
interface LeadCardProps {
  lead: LeadMatch;
  onView: (leadId: number) => void;
  onRespond: (leadId: number) => void;
}
```

**Features:**
- Match score visualization (0-100 with color coding)
- "Why this is a great match" breakdown
- Hot match badge (score >= 90)
- Property details preview
- Quick actions (View Details, Respond)
- Time since submitted
- Response deadline countdown

---

## 6. Next Steps & Implementation Checklist

### Phase 1 Checklist
- [ ] Run all database migrations
- [ ] Create Eloquent models with relationships
- [ ] Build data import Artisan command
- [ ] Set up geocoding service (Google Maps API)
- [ ] Import all 925 property managers
- [ ] Verify data integrity
- [ ] Set up Next.js App Router structure
- [ ] Configure Tailwind with design tokens
- [ ] Build Header and Footer components
- [ ] Set up Docker development environment

### Phase 2 Checklist
- [ ] Create state API endpoints
- [ ] Create city API endpoints
- [ ] Implement API response caching
- [ ] Build state landing page template
- [ ] Build city landing page template
- [ ] Implement filtering and sorting
- [ ] Add SEO metadata generation
- [ ] Generate sitemap (all states, cities, PMs)
- [ ] Set up Google Analytics
- [ ] Deploy to staging

### Phase 3 Checklist
- [ ] Create PM profile API endpoint
- [ ] Build PM profile page template
- [ ] Implement lead submission API
- [ ] Build multi-step lead wizard
- [ ] Add geocoding for lead addresses
- [ ] Create success/confirmation pages
- [ ] Build comparison tool UI
- [ ] Set up email notifications
- [ ] Test lead flow end-to-end

### Phase 4 Checklist
- [ ] Implement lead matching algorithm
- [ ] Create matching service class
- [ ] Set up Laravel Queue system
- [ ] Build tier-based access logic
- [ ] Create PM authentication
- [ ] Build PM dashboard
- [ ] Create leads view for PMs
- [ ] Build lead response UI
- [ ] Add WebSocket/Pusher for real-time updates
- [ ] Create analytics tracking
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment

---

## 7. Performance Optimization Strategy

### Database
- Index all foreign keys
- Index geographic coordinates for spatial queries
- Use database query caching for aggregate data
- Consider read replicas for scaling

### API
- Implement Redis caching for:
  - State/city lists (1 hour TTL)
  - Featured PMs (30 min TTL)
  - PM profiles (15 min TTL)
- Use API rate limiting
- Compress responses with gzip

### Frontend
- Static generation for state/city pages
- ISR with 1-hour revalidation for PM profiles
- Image optimization with Next.js Image component
- Code splitting for dashboard routes
- Prefetch links on hover

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track Core Web Vitals
- Set up alerts for >2s page load times

---

**End of Implementation Roadmap**
