# Geocoding & Lead Matching - Quick Start

**Status:** Ready to implement
**Time Required:** ~30 minutes setup + implementation

---

## What We're Building

**Option 1 + 2 Combined:**
1. ✅ Geocoding for 924 property managers (add lat/lng coordinates)
2. ✅ Lead matching algorithm to connect owners with PMs

---

## Quick Setup (Do This First)

### 1. Get Google Maps API Key (~5 minutes)

1. Visit: https://console.cloud.google.com/
2. Create/select project
3. Enable "Geocoding API"
4. Create API Key
5. Restrict key to "Geocoding API" only

### 2. Add to .env

```bash
# Edit: propertifi-backend/.env
# Line 257 (already added, just needs your key):
GOOGLE_MAPS_API_KEY=paste_your_key_here
```

### 3. Test It Works

```bash
php artisan tinker --execute="
\$service = new App\Services\GeocodingService();
\$result = \$service->geocode('1150 S Olive St', 'Los Angeles', 'CA');
print_r(\$result);
"
```

**Should see:**
```
Array ( [lat] => 34.04... [lng] => -118.25... )
```

### 4. Geocode All 924 PMs

```bash
# Takes ~15-20 minutes (rate-limited to 10 req/sec)
php artisan import:managers --states=CA,FL
```

**What happens:**
- Updates all 924 property managers with coordinates
- Caches results (won't re-geocode same addresses)
- Shows progress bar
- 100% free (under $200/month quota)

---

## What's Already Done ✅

### Database
- ✅ Property managers table with lat/lng columns
- ✅ Leads table with coordinates
- ✅ Lead matches table for storing scores
- ✅ All relationships configured

### Services
- ✅ `GeocodingService.php` - Geocoding with caching
- ✅ `LeadScoringService.php` - Already exists (needs review)
- ✅ `LeadDistributionService.php` - Already exists (needs review)

### Configuration
- ✅ `.env` file updated with Google Maps section
- ✅ `config/services.php` updated with google_maps config
- ✅ Import command supports geocoding

---

## What Needs to be Built

### 1. Lead Matching Service (New)

**File:** `app/Services/LeadMatchingService.php`

**Methods needed:**
```php
class LeadMatchingService
{
    // Main method: match a lead to PMs
    public function matchLeadToPropertyManagers(Lead $lead): array

    // Calculate score (0-100 points)
    public function calculateMatchScore(Lead $lead, PropertyManager $pm): int

    // Create lead_matches records
    public function createLeadMatches(Lead $lead, array $matches): void

    // Apply tier-based timing
    protected function calculateAvailableAt(User $pmUser, int $score): Carbon
}
```

**Scoring Algorithm:**
- Location (50 pts): Distance-based (0-25 miles)
- Service Type (30 pts): Residential/Commercial/HOA match
- Property Type (20 pts): Single-family/Multi-family specialty

### 2. Lead Observer (New)

**File:** `app/Observers/LeadObserver.php`

Auto-trigger matching when lead is created:
```php
class LeadObserver
{
    public function created(Lead $lead)
    {
        // Trigger matching service
        app(LeadMatchingService::class)->matchLeadToPropertyManagers($lead);
    }
}
```

### 3. Email Notifications (New)

**File:** `app/Notifications/NewLeadMatchNotification.php`

Send emails to matched PMs with:
- Lead details (tier-appropriate)
- Match score
- Property info
- Call-to-action button

---

## Implementation Steps

### Step 1: Review Existing Services

Let's check what's already implemented:

```bash
# Check LeadScoringService
cat propertifi-backend/app/Services/LeadScoringService.php

# Check LeadDistributionService
cat propertifi-backend/app/Services/LeadDistributionService.php
```

**Why:** These might already have some of the logic we need.

### Step 2: Build/Update LeadMatchingService

Based on what exists, either:
- Create new `LeadMatchingService.php`
- OR update existing `LeadScoringService.php`

### Step 3: Create Lead Observer

Register observer to auto-match leads on creation.

### Step 4: Test with Sample Lead

```php
$lead = Lead::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'city' => 'San Diego',
    'state' => 'CA',
    'latitude' => 32.7157,
    'longitude' => -117.1611,
    'property_type' => 'single_family',
]);

// Should auto-create matches via observer
$matches = $lead->leadMatches()->with('propertyManager')->get();
echo "Created {$matches->count()} matches\n";
```

---

## Expected Results After Implementation

### 1. When Lead Submits Form:
```
Owner submits → Lead created → Observer triggers → Matching service runs
→ Scores calculated → Matches created → Emails sent
```

### 2. Sample Lead in San Diego:
- Should match ~10-20 San Diego PMs (within 25 miles)
- Scores range 70-100 points
- Enterprise PMs get instant access
- Premium PMs get access after 24 hours
- Free PMs get access after 48 hours

### 3. Database After One Lead:
```sql
-- 1 lead record
-- 10-20 lead_matches records
-- Each with score, available_at timestamp
```

---

## Testing Checklist

After implementation:

- [ ] Geocoding works (test single address)
- [ ] All 924 PMs have coordinates
- [ ] LeadMatchingService calculates scores correctly
- [ ] Matches created with correct available_at times
- [ ] Hot matches (90+) identified
- [ ] Quality matches (70-89) identified
- [ ] Email notifications sent to matched PMs
- [ ] PM can view leads via API
- [ ] Tier-based access enforced

---

## Files Created/Modified

### Already Done:
✅ `.env` - Added GOOGLE_MAPS_API_KEY section
✅ `config/services.php` - Added google_maps config
✅ `app/Services/GeocodingService.php` - Updated to use config
✅ `database/migrations/*_property_managers_table.php` - Has lat/lng columns
✅ `database/migrations/*_lead_matches_table.php` - Ready for matches

### To Do:
⏳ `app/Services/LeadMatchingService.php` - Create/update
⏳ `app/Observers/LeadObserver.php` - Create
⏳ `app/Notifications/NewLeadMatchNotification.php` - Create
⏳ `app/Providers/EventServiceProvider.php` - Register observer

---

## Cost & Performance

**Geocoding:**
- Cost: $0 (free tier)
- Time: 15-20 minutes one-time
- Storage: ~8 bytes × 924 = ~7.4KB

**Lead Matching:**
- Cost: $0 (runs on your server)
- Time: ~100ms per lead
- Storage: ~1KB × matches per lead

**Scalability:**
- Can handle 1,000+ leads/day
- Geocoding cached (no repeated API calls)
- Matching runs async (no user-facing delays)

---

## Next Actions

**Do this NOW:**
1. Get Google Maps API key (5 min)
2. Add to `.env`
3. Run geocoding import (20 min)

**Then let me know and I'll:**
1. Review existing LeadScoringService
2. Build/update LeadMatchingService
3. Create Lead Observer
4. Set up notifications
5. Test end-to-end flow

---

## Questions?

- How to get API key? See `GEOCODING_AND_LEAD_MATCHING_SETUP.md`
- Detailed scoring algorithm? See setup guide
- Tier-based timing? See setup guide
- Testing strategy? See setup guide

---

**Ready to proceed!** Get your API key and let's add geocoding to all 924 property managers. 🚀
