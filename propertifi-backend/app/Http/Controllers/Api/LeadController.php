<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Models\LeadAssignment;
use App\Models\User;
use App\Mail\LeadSubmitMail;
use App\Services\GeocodingService;
use App\Notifications\LeadMatchedNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LeadController extends Controller
{
    /**
     * Store a new lead from the multi-step form
     *
     * @param StoreLeadRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreLeadRequest $request)
    {
        try {
            // Generate unique confirmation number
            $confirmationNumber = 'LEAD-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);

            // Prepare lead data
            $leadData = [
                'name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->street_address,
                'city' => $request->city,
                'state' => $request->state,
                'zipcode' => $request->zip_code,
                'property_type' => $request->property_type,
                'number_of_units' => $request->number_of_units,
                'square_footage' => $request->square_footage,
                'additional_services' => $request->additional_services ? json_encode($request->additional_services) : null,
                'preferred_contact' => $request->preferred_contact,
                'source' => $request->source ?? 'get-started-form',
                'confirmation_number' => $confirmationNumber,
                'unique_id' => '', // Temporary value, will be updated after creation
                'status' => 'new'
            ];

            // Create lead
            $lead = Lead::create($leadData);

            // Generate unique ID (legacy format)
            $uniqueID = 'L' . str_pad($lead->id, 3, "0", STR_PAD_LEFT);
            $lead->update(['unique_id' => $uniqueID]);

            // Geocode the lead address
            $this->geocodeLead($lead, $request);

            // Find and assign matching property managers
            $assignments = $this->assignMatchingManagers($lead, $request);
            $matchedManagersCount = count($assignments);

            // Send confirmation email
            if ($request->email && filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
                try {
                    $emailData = [
                        'userData' => $lead,
                        'subject' => 'Thank you for reaching out!',
                        'confirmation_number' => $confirmationNumber
                    ];

                    Mail::to([strtolower(trim($request->email))])
                        ->bcc([
                            strtolower(env('BCC')),
                            strtolower(env('BCC2')),
                            strtolower(env('BCC3')),
                            strtolower(env('BCC4')),
                            strtolower(env('BCC5'))
                        ])
                        ->send(new LeadSubmitMail($emailData));
                } catch (\Exception $e) {
                    // Log email error but don't fail the request
                    \Log::error('Failed to send lead confirmation email: ' . $e->getMessage());
                }
            }

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Your request has been submitted successfully',
                'lead_id' => $lead->id,
                'data' => [
                    'id' => $lead->id,
                    'confirmation_number' => $confirmationNumber,
                    'matched_managers_count' => $matchedManagersCount,
                    'assignments' => $assignments
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Lead submission error: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit lead. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Geocode a lead's address and update the lead record
     *
     * @param Lead $lead
     * @param StoreLeadRequest $request
     * @return void
     */
    private function geocodeLead($lead, $request)
    {
        try {
            $geocodingService = new GeocodingService();
            $coordinates = $geocodingService->geocode(
                $request->street_address,
                $request->city,
                $request->state,
                $request->zip_code
            );

            if ($coordinates) {
                $lead->update([
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lng'],
                    'geocoded' => true
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to geocode lead: ' . $e->getMessage());
        }
    }

    /**
     * Find matching property managers and create assignments
     * Implements tiered system: premium tiers get leads first, free tiers get delayed access
     *
     * @param Lead $lead
     * @param StoreLeadRequest $request
     * @return array Array of assignment data
     */
    private function assignMatchingManagers($lead, $request)
    {
        $assignments = [];
        $propertyType = $request->property_type;
        $numberOfUnits = $request->number_of_units;

        // Get all active managers with their preferences AND tier information
        // Support both 'manager' and 'pm' user types
        $managers = DB::table('users')
            ->join('user_preferences', 'users.id', '=', 'user_preferences.user_id')
            ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
            ->whereIn('users.type', ['manager', 'pm'])
            ->where('users.status', 1)
            ->where('user_preferences.is_active', true)
            ->select(
                'users.id as manager_id',
                'users.name as manager_name',
                'user_preferences.property_types',
                'user_preferences.min_units',
                'user_preferences.max_units',
                'user_preferences.latitude',
                'user_preferences.longitude',
                'user_preferences.service_radius_miles',
                'user_preferences.zip_codes',
                'tiers.name as tier_name',
                DB::raw('COALESCE(tiers.exclusivity_hours, 0) as exclusivity_hours')
            )
            ->get();

        // Separate managers into premium (exclusivity > 0) and standard (exclusivity = 0) tiers
        $premiumMatches = [];
        $standardMatches = [];

        foreach ($managers as $manager) {
            $matchScore = 0;
            $distanceMiles = null;
            $isMatch = true;

            // Check property type match
            if ($manager->property_types) {
                $propertyTypes = is_array($manager->property_types)
                    ? $manager->property_types
                    : json_decode($manager->property_types, true);

                if (!is_array($propertyTypes) || !in_array($propertyType, $propertyTypes)) {
                    $isMatch = false;
                    continue;
                }
                $matchScore += 25;
            } else {
                // NULL means accepts all property types
                $matchScore += 20;
            }

            // Check unit range match
            if ($numberOfUnits) {
                if ($manager->min_units && $numberOfUnits < $manager->min_units) {
                    $isMatch = false;
                    continue;
                }
                if ($manager->max_units && $numberOfUnits > $manager->max_units) {
                    $isMatch = false;
                    continue;
                }
                $matchScore += 25;
            }

            // Check location match using Haversine distance
            $leadLat = $lead->latitude;
            $leadLng = $lead->longitude;
            $managerLat = $manager->latitude;
            $managerLng = $manager->longitude;
            $serviceRadius = $manager->service_radius_miles ?? 25; // Default 25 miles

            if ($leadLat && $leadLng && $managerLat && $managerLng) {
                // Calculate distance using Haversine formula
                $distanceMiles = $this->calculateDistance($managerLat, $managerLng, $leadLat, $leadLng);

                if ($distanceMiles > $serviceRadius) {
                    $isMatch = false;
                    continue;
                }

                // Distance score: closer = higher score (max 50 points)
                $distanceScore = max(0, 50 * (1 - ($distanceMiles / $serviceRadius)));
                $matchScore += $distanceScore;
            } else {
                // Fallback to zip code matching if coordinates not available
                if ($manager->zip_codes) {
                    $zipCodes = is_array($manager->zip_codes)
                        ? $manager->zip_codes
                        : json_decode($manager->zip_codes, true);

                    if (!is_array($zipCodes) || !in_array($request->zip_code, $zipCodes)) {
                        $isMatch = false;
                        continue;
                    }
                    $matchScore += 30;
                } else {
                    // NULL zip_codes means accepts all locations
                    $matchScore += 20;
                }
            }

            if ($isMatch) {
                // Categorize into premium or standard based on exclusivity_hours
                $matchData = [
                    'manager' => $manager,
                    'match_score' => $matchScore,
                    'distance_miles' => $distanceMiles
                ];

                if ($manager->exclusivity_hours > 0) {
                    $premiumMatches[] = $matchData;
                } else {
                    $standardMatches[] = $matchData;
                }
            }
        }

        // Calculate the maximum exclusivity hours among premium matches
        $maxExclusivityHours = 0;
        foreach ($premiumMatches as $match) {
            if ($match['manager']->exclusivity_hours > $maxExclusivityHours) {
                $maxExclusivityHours = $match['manager']->exclusivity_hours;
            }
        }

        // Determine available_at timestamp for standard tier
        // If there are premium matches, delay standard tier access
        // If no premium matches, give immediate access to everyone
        $standardAvailableAt = null;
        if (count($premiumMatches) > 0 && $maxExclusivityHours > 0) {
            $standardAvailableAt = now()->addHours($maxExclusivityHours);
        } else {
            $standardAvailableAt = now(); // Immediate access if no premium matches
        }

        // Create assignments for premium tier (immediate access)
        foreach ($premiumMatches as $match) {
            $manager = $match['manager'];
            $matchScore = $match['match_score'];
            $distanceMiles = $match['distance_miles'];

            $assignment = LeadAssignment::create([
                'lead_id' => $lead->id,
                'manager_id' => $manager->manager_id,
                'distance_miles' => $distanceMiles,
                'match_score' => $matchScore,
                'status' => 'pending',
                'available_at' => now() // Immediate access for premium
            ]);

            // Send immediate notification to premium tier managers
            try {
                $managerUser = User::find($manager->manager_id);
                if ($managerUser) {
                    $managerUser->notify(new LeadMatchedNotification($lead, $assignment));
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send lead notification: ' . $e->getMessage());
            }

            $assignments[] = [
                'assignment_id' => $assignment->id,
                'manager_id' => $manager->manager_id,
                'manager_name' => $manager->manager_name,
                'distance_miles' => $distanceMiles ? round($distanceMiles, 2) : null,
                'match_score' => round($matchScore, 2),
                'tier' => $manager->tier_name,
                'available_at' => now()->toIso8601String()
            ];
        }

        // Create assignments for standard tier (delayed access)
        foreach ($standardMatches as $match) {
            $manager = $match['manager'];
            $matchScore = $match['match_score'];
            $distanceMiles = $match['distance_miles'];

            $assignment = LeadAssignment::create([
                'lead_id' => $lead->id,
                'manager_id' => $manager->manager_id,
                'distance_miles' => $distanceMiles,
                'match_score' => $matchScore,
                'status' => 'pending',
                'available_at' => $standardAvailableAt
            ]);

            // Schedule delayed notification for standard tier
            // Only send notification if it's immediate access (no premium matches)
            if ($standardAvailableAt->isPast() || $standardAvailableAt->equalTo(now())) {
                try {
                    $managerUser = User::find($manager->manager_id);
                    if ($managerUser) {
                        $managerUser->notify(new LeadMatchedNotification($lead, $assignment));
                    }
                } catch (\Exception $e) {
                    \Log::error('Failed to send lead notification: ' . $e->getMessage());
                }
            } else {
                // Schedule notification for later using Laravel's delay feature
                try {
                    $managerUser = User::find($manager->manager_id);
                    if ($managerUser) {
                        $managerUser->notify((new LeadMatchedNotification($lead, $assignment))
                            ->delay($standardAvailableAt));
                    }
                } catch (\Exception $e) {
                    \Log::error('Failed to schedule lead notification: ' . $e->getMessage());
                }
            }

            $assignments[] = [
                'assignment_id' => $assignment->id,
                'manager_id' => $manager->manager_id,
                'manager_name' => $manager->manager_name,
                'distance_miles' => $distanceMiles ? round($distanceMiles, 2) : null,
                'match_score' => round($matchScore, 2),
                'tier' => $manager->tier_name,
                'available_at' => $standardAvailableAt->toIso8601String()
            ];
        }

        // Sort by match score (highest first)
        usort($assignments, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });

        return $assignments;
    }


    /**
     * Calculate distance between two points using Haversine formula
     * This will be used once we implement geocoding for leads
     *
     * @param float $lat1 Latitude of point 1
     * @param float $lon1 Longitude of point 1
     * @param float $lat2 Latitude of point 2
     * @param float $lon2 Longitude of point 2
     * @return float Distance in miles
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 3959; // Earth's radius in miles

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos($latFrom) * cos($latTo) *
             sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
