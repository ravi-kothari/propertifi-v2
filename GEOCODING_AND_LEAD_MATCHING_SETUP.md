# Geocoding & Lead Matching Setup Guide

**Date:** November 30, 2025
**Status:** Ready to configure and implement

---

## Phase 1: Geocoding Setup

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Geocoding API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

5. **Restrict the API Key** (Important for security):
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Check only "Geocoding API"
   - Save

### Step 2: Add API Key to .env

```bash
# Edit propertifi-backend/.env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 3: Test the Geocoding Service

```bash
php artisan tinker --execute="
\$service = new App\Services\GeocodingService();
\$result = \$service->geocode('1150 S Olive St', 'Los Angeles', 'CA');
print_r(\$result);
"
```

**Expected output:**
```
Array
(
    [lat] => 34.0422
    [lng] => -118.2575
    [formatted_address] => 1150 S Olive St, Los Angeles, CA 90015, USA
)
```

### Step 4: Geocode All Property Managers

```bash
# This will add lat/lng to all 924 property managers
# Takes ~15-20 minutes due to rate limiting (10 requests/second)
php artisan import:managers --states=CA,FL
```

**What happens:**
- Geocodes each of the 924 property manager addresses
- Updates existing records with lat/lng coordinates
- Caches results for 30 days
- Rate-limited to avoid API quota issues
- Progress bar shows real-time status

**Cost:** FREE (924 requests, well under $200/month free tier)

---

## Phase 2: Lead Matching Service

### Overview

The lead matching system will:
1. Calculate match scores (0-100 points) for each PM when a lead submits
2. Create `lead_matches` records with scores
3. Implement tier-based access timing
4. Send email notifications to matched PMs

### Scoring Algorithm

**Total: 100 points**

1. **Location Score (50 points):**
   - 0-5 miles: 50 points
   - 5-10 miles: 40 points
   - 10-15 miles: 30 points
   - 15-20 miles: 20 points
   - 20-25 miles: 10 points
   - 25+ miles: 0 points

2. **Service Type Match (30 points):**
   - Exact match (e.g., Residential = Residential): 30 points
   - Compatible match (e.g., Multi-Family in Residential PM): 20 points
   - No match: 0 points

3. **Property Type Specialty (20 points):**
   - PM specializes in this property type: 20 points
   - PM has experience but not specialty: 10 points
   - No specific experience: 0 points

**Quality Thresholds:**
- **Hot Match:** 90+ points (immediate notification)
- **Quality Match:** 70-89 points (normal notification)
- **Below Threshold:** <70 points (no match created)

### Tier-Based Access

**Enterprise Tier:**
- Instant access to all hot matches
- 1-hour head start on quality matches
- No lead cap

**Premium Tier:**
- 24-hour head start on quality matches
- Higher lead cap (50/month)
- Priority sorting

**Free Tier:**
- 48-hour delay on quality matches
- Basic lead cap (10/month)
- Standard sorting

---

## Implementation Plan

### Files to Create

1. **Lead Matching Service**
   ```
   propertifi-backend/app/Services/LeadMatchingService.php
   ```
   - `matchLeadToPropertyManagers(Lead $lead)`
   - `calculateMatchScore(Lead $lead, PropertyManager $pm)`
   - `createLeadMatches(Lead $lead, array $matches)`
   - `notifyMatchedPropertyManagers(Lead $lead)`

2. **Lead Match Observer**
   ```
   propertifi-backend/app/Observers/LeadObserver.php
   ```
   - Automatically trigger matching when lead is created
   - Handle lead status changes

3. **Lead Match Notification**
   ```
   propertifi-backend/app/Notifications/NewLeadMatchNotification.php
   ```
   - Email notification to PM
   - Include lead details (based on tier access)
   - Call-to-action button

### Database Changes

All tables already exist from migrations:
- ✅ `property_managers` (with lat/lng after geocoding)
- ✅ `leads` (with property details)
- ✅ `lead_matches` (for storing matches and scores)
- ✅ `users` (with tier information)

### API Endpoints to Create

```php
// View matched leads (PM dashboard)
GET /api/property-manager/leads
GET /api/property-manager/leads/{leadId}

// Respond to lead
POST /api/property-manager/leads/{leadId}/respond
PUT /api/property-manager/leads/{leadId}/status
```

---

## Testing Strategy

### Test 1: Single Lead Matching

```php
// Create a test lead in San Diego
$lead = Lead::create([
    'name' => 'Test Owner',
    'email' => 'test@example.com',
    'phone' => '555-1234',
    'property_address' => '123 Main St',
    'city' => 'San Diego',
    'state' => 'CA',
    'zip_code' => '92101',
    'latitude' => 32.7157,
    'longitude' => -117.1611,
    'property_type' => 'single_family',
    'service_type' => 'residential',
]);

// Manually trigger matching
$matchingService = new LeadMatchingService();
$matches = $matchingService->matchLeadToPropertyManagers($lead);

// Verify results
echo "Found " . count($matches) . " matches\n";
foreach ($matches as $match) {
    echo "PM: {$match['pm']->name}, Score: {$match['score']}\n";
}
```

### Test 2: Distance Calculation

```php
// Test distance between two San Diego PMs
$pm1 = PropertyManager::where('city', 'San Diego')->first();
$pm2 = PropertyManager::where('city', 'San Diego')->skip(1)->first();

$distance = \App\Services\GeocodingService::calculateDistance(
    $pm1->latitude,
    $pm1->longitude,
    $pm2->latitude,
    $pm2->longitude
);

echo "Distance: {$distance} miles\n";
```

### Test 3: Tier-Based Access

```php
// Check available_at times for different tiers
$lead = Lead::first();
$matches = $lead->leadMatches()->with('propertyManager.user')->get();

foreach ($matches as $match) {
    $tier = $match->propertyManager->user->tier ?? 'free';
    $availableAt = $match->available_at;
    echo "Tier: {$tier}, Available: {$availableAt}\n";
}
```

---

## Configuration

### Lead Matching Settings (.env)

```bash
# Maximum leads per PM per month (by tier)
FREE_TIER_LEAD_CAP=10
PREMIUM_TIER_LEAD_CAP=50
ENTERPRISE_TIER_LEAD_CAP=999  # Effectively unlimited

# Access timing (hours)
PREMIUM_EXCLUSIVITY_HOURS=24
FREE_DELAY_HOURS=48

# Matching thresholds
MATCH_QUALITY_THRESHOLD=70
MATCH_HOT_THRESHOLD=90

# Maximum distance for matching (miles)
MAX_MATCH_DISTANCE=25

# Notification settings
NOTIFY_ON_HOT_MATCH=true
NOTIFY_ON_QUALITY_MATCH=true
```

---

## Next Steps Checklist

### Geocoding Setup
- [ ] Get Google Maps API key
- [ ] Add API key to `.env`
- [ ] Test geocoding service
- [ ] Run geocoding on all 924 PMs
- [ ] Verify all PMs have coordinates

### Lead Matching Implementation
- [ ] Create `LeadMatchingService.php`
- [ ] Implement scoring algorithm
- [ ] Create `LeadObserver.php` for auto-matching
- [ ] Create `NewLeadMatchNotification.php`
- [ ] Add matching configuration to `.env`
- [ ] Test with sample leads
- [ ] Verify tier-based access timing

### API Endpoints
- [ ] Create PM Leads Controller
- [ ] Add routes for lead viewing/responding
- [ ] Test API endpoints
- [ ] Document API in Postman/Swagger

### Frontend Integration
- [ ] Create PM dashboard for viewing leads
- [ ] Build lead response form
- [ ] Add lead status indicators
- [ ] Test end-to-end flow

---

## Monitoring & Analytics

### Metrics to Track

1. **Matching Performance:**
   - Average matches per lead
   - Average match score
   - Hot match percentage
   - Quality match percentage

2. **PM Engagement:**
   - Response rate by tier
   - Time to respond
   - Win rate (leads converted)

3. **System Health:**
   - Geocoding success rate
   - API quota usage
   - Matching service latency

### Logging

```php
// Log in LeadMatchingService
Log::info('Lead matching started', ['lead_id' => $lead->id]);
Log::info('Matches created', [
    'lead_id' => $lead->id,
    'total_matches' => count($matches),
    'hot_matches' => $hotCount,
    'quality_matches' => $qualityCount,
]);
```

---

## Cost Analysis

### Google Maps Geocoding
- **Free Tier:** $200 credit/month = ~40,000 requests
- **Our Usage:** 924 requests (one-time) + ~100/month for new PMs
- **Cost:** $0 (well within free tier)

### Server Resources
- **Geocoding:** One-time 15-20 minute operation
- **Matching:** ~100ms per lead (negligible)
- **Storage:** Lead matches table will grow over time
  - 1 lead × 10 matches average = 10 records
  - 1,000 leads/month = 10,000 records/month
  - At 1KB/record = 10MB/month (minimal)

---

## Security Considerations

1. **API Key Protection:**
   - ✅ Store in `.env`, never commit to git
   - ✅ Restrict to Geocoding API only
   - ✅ Use IP restrictions in production

2. **Lead Data Privacy:**
   - Tier-based access prevents free users from seeing full lead details immediately
   - Email/phone masked until PM responds
   - GDPR compliance: leads can request deletion

3. **Rate Limiting:**
   - Geocoding: 10 requests/second (well below Google's limits)
   - Matching: No external API calls, runs locally

---

## Troubleshooting

### Issue: Geocoding Returns NULL

**Check:**
1. API key is set correctly in `.env`
2. Geocoding API is enabled in Google Cloud
3. Address format is valid
4. API quota not exceeded

```bash
# Test API key
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Los+Angeles,CA&key=YOUR_API_KEY"
```

### Issue: No Matches Found

**Check:**
1. Property managers have valid coordinates
2. Lead has valid coordinates
3. `MAX_MATCH_DISTANCE` is reasonable (default 25 miles)
4. `MATCH_QUALITY_THRESHOLD` isn't too high

```bash
# Count PMs with coordinates
php artisan tinker --execute="echo App\Models\PropertyManager::whereNotNull('latitude')->count();"
```

### Issue: Wrong Tier Access Times

**Check:**
1. User has correct `tier` value in database
2. Timezone settings are correct
3. `available_at` calculation logic in LeadMatchingService

---

## Success Criteria

✅ All 924 PMs have valid lat/lng coordinates
✅ Test lead creates 5-15 matches in target city
✅ Match scores are distributed correctly (hot/quality/below)
✅ Tier-based access timing works as expected
✅ Email notifications sent to matched PMs
✅ PM can view and respond to leads via API
✅ System handles 100+ leads/day without issues

---

## Ready to Start!

Everything is set up and ready. Just need to:

1. **Add your Google Maps API key to `.env`**
2. **Run the geocoding import**
3. **Build the LeadMatchingService**

The foundation is solid. Let's make Propertifi's core matching feature come to life! 🚀
