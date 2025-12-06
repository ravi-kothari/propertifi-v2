<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadAssignment;
use App\Models\LeadView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OwnerDashboardController extends Controller
{
    /**
     * Display the authenticated owner's dashboard data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $owner = Auth::user();

        // Load leads with status information
        $leads = $this->getLeadsWithStatus($owner->id);
        $recentLeads = $leads->take(5);

        // Load bookmarks and calculations (if relationships exist)
        $bookmarks = method_exists($owner, 'bookmarks') ? $owner->bookmarks()->with('bookmarkable')->get() : collect([]);
        $savedCalculations = method_exists($owner, 'savedCalculations') ? $owner->savedCalculations()->latest()->get() : collect([]);

        // Calculate aggregate statistics
        $totalViews = $leads->sum('views_count');
        $totalResponses = $leads->sum('responses_count');
        $activeLeads = $leads->where('status', '!=', 'closed')->count();

        // Build recent activity from lead events
        $recentActivity = $this->getRecentActivity($owner->id);

        return response()->json([
            'success' => true,
            'data' => [
                'owner' => [
                    'id' => $owner->id,
                    'name' => $owner->name,
                    'email' => $owner->email,
                ],
                'recent_leads' => $recentLeads->values(),
                'bookmarks' => $bookmarks,
                'saved_calculations' => $savedCalculations,
                'recent_activity' => $recentActivity,
                'stats' => [
                    'total_leads' => $leads->count(),
                    'active_leads' => $activeLeads,
                    'total_views' => $totalViews,
                    'total_responses' => $totalResponses,
                    'total_bookmarks' => $bookmarks->count(),
                    'total_calculations' => $savedCalculations->count(),
                ],
            ],
        ]);
    }

    /**
     * Get all leads for the owner with pagination
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function leads(Request $request)
    {
        $owner = Auth::user();
        $perPage = $request->get('per_page', 10);

        $leads = $this->getLeadsWithStatus($owner->id);

        // Apply filters
        if ($request->has('status')) {
            $leads = $leads->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_direction', 'desc');

        if ($sortDir === 'asc') {
            $leads = $leads->sortBy($sortBy);
        } else {
            $leads = $leads->sortByDesc($sortBy);
        }

        // Paginate manually since we're working with a collection
        $page = $request->get('page', 1);
        $total = $leads->count();
        $items = $leads->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'success' => true,
            'data' => $items,
            'meta' => [
                'current_page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => $total,
                'last_page' => ceil($total / $perPage),
            ],
        ]);
    }

    /**
     * Get detailed information about a specific lead
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showLead($id)
    {
        $owner = Auth::user();

        $lead = Lead::where('id', $id)
            ->where('owner_id', $owner->id)
            ->first();

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead not found',
            ], 404);
        }

        // Get view count and unique viewers
        $viewsCount = LeadView::where('lead_id', $id)->count();
        $uniqueViewers = LeadView::where('lead_id', $id)
            ->distinct('manager_id')
            ->count('manager_id');

        // Get assignments with manager info
        $assignments = LeadAssignment::where('lead_id', $id)
            ->with(['manager:id,name,email'])
            ->orderBy('match_score', 'desc')
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'manager_name' => $assignment->manager->name ?? 'Unknown',
                    'distance_miles' => $assignment->distance_miles,
                    'match_score' => $assignment->match_score,
                    'status' => $assignment->status,
                    'contacted_at' => $assignment->contacted_at,
                    'responded_at' => $assignment->responded_at,
                    'created_at' => $assignment->created_at,
                ];
            });

        // Get activity timeline
        $timeline = $this->getLeadTimeline($id);

        // Determine overall lead status
        $status = $this->determineLeadStatus($lead, $assignments);

        return response()->json([
            'success' => true,
            'data' => [
                'lead' => [
                    'id' => $lead->id,
                    'confirmation_number' => $lead->confirmation_number,
                    'property_address' => $lead->address,
                    'property_city' => $lead->city,
                    'property_state' => $lead->state,
                    'property_zip' => $lead->zipcode,
                    'property_type' => $lead->property_type,
                    'number_of_units' => $lead->number_of_units,
                    'square_footage' => $lead->square_footage,
                    'preferred_contact' => $lead->preferred_contact,
                    'created_at' => $lead->created_at,
                    'status' => $status,
                ],
                'stats' => [
                    'total_views' => $viewsCount,
                    'unique_viewers' => $uniqueViewers,
                    'total_matches' => $assignments->count(),
                    'contacted_count' => $assignments->where('status', 'contacted')->count(),
                    'accepted_count' => $assignments->where('status', 'accepted')->count(),
                ],
                'assignments' => $assignments,
                'timeline' => $timeline,
            ],
        ]);
    }

    /**
     * Get leads with status information
     *
     * @param int $ownerId
     * @return \Illuminate\Support\Collection
     */
    private function getLeadsWithStatus($ownerId)
    {
        $leads = Lead::where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $leads->map(function ($lead) {
            // Get counts
            $viewsCount = LeadView::where('lead_id', $lead->id)->count();
            $assignments = LeadAssignment::where('lead_id', $lead->id)->get();
            $responsesCount = $assignments->whereIn('status', ['contacted', 'accepted'])->count();

            // Determine status
            $status = $this->determineLeadStatus($lead, $assignments);

            return [
                'id' => $lead->id,
                'confirmation_number' => $lead->confirmation_number,
                'property_address' => $lead->address,
                'property_city' => $lead->city,
                'property_state' => $lead->state,
                'property_zip' => $lead->zipcode,
                'property_type' => $lead->property_type,
                'number_of_units' => $lead->number_of_units,
                'square_footage' => $lead->square_footage,
                'created_at' => $lead->created_at,
                'status' => $status,
                'views_count' => $viewsCount,
                'matched_managers_count' => $assignments->count(),
                'responses_count' => $responsesCount,
            ];
        });
    }

    /**
     * Determine the overall status of a lead
     *
     * @param Lead $lead
     * @param \Illuminate\Support\Collection $assignments
     * @return string
     */
    private function determineLeadStatus($lead, $assignments)
    {
        if ($lead->status === 0) {
            return 'closed';
        }

        $acceptedCount = $assignments->where('status', 'accepted')->count();
        $contactedCount = $assignments->where('status', 'contacted')->count();

        if ($acceptedCount > 0) {
            return 'contacted';
        }

        if ($contactedCount > 0) {
            return 'contacted';
        }

        if ($assignments->count() > 0) {
            return 'matched';
        }

        return 'new';
    }

    /**
     * Get recent activity across all leads
     *
     * @param int $ownerId
     * @return array
     */
    private function getRecentActivity($ownerId)
    {
        $activities = [];

        // Get recent lead submissions
        $recentLeads = Lead::where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        foreach ($recentLeads as $lead) {
            $activities[] = [
                'type' => 'lead_submitted',
                'message' => "You submitted a lead for {$lead->city}, {$lead->state}",
                'timestamp' => $lead->created_at,
                'lead_id' => $lead->id,
            ];
        }

        // Get recent assignments
        $leadIds = Lead::where('owner_id', $ownerId)->pluck('id');

        $recentAssignments = LeadAssignment::whereIn('lead_id', $leadIds)
            ->with(['lead', 'manager:id,name'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        foreach ($recentAssignments as $assignment) {
            if ($assignment->status === 'pending') {
                $activities[] = [
                    'type' => 'manager_matched',
                    'message' => "A property manager was matched to your {$assignment->lead->city} lead",
                    'timestamp' => $assignment->created_at,
                    'lead_id' => $assignment->lead_id,
                ];
            } elseif ($assignment->status === 'contacted' && $assignment->contacted_at) {
                $activities[] = [
                    'type' => 'manager_contacted',
                    'message' => "{$assignment->manager->name} viewed your {$assignment->lead->city} lead",
                    'timestamp' => $assignment->contacted_at,
                    'lead_id' => $assignment->lead_id,
                ];
            } elseif ($assignment->status === 'accepted' && $assignment->responded_at) {
                $activities[] = [
                    'type' => 'manager_accepted',
                    'message' => "{$assignment->manager->name} accepted your {$assignment->lead->city} lead",
                    'timestamp' => $assignment->responded_at,
                    'lead_id' => $assignment->lead_id,
                ];
            }
        }

        // Sort by timestamp and take most recent
        usort($activities, function ($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        return array_slice($activities, 0, 10);
    }

    /**
     * Get timeline for a specific lead
     *
     * @param int $leadId
     * @return array
     */
    private function getLeadTimeline($leadId)
    {
        $timeline = [];

        $lead = Lead::find($leadId);
        if (!$lead) return [];

        // Lead created
        $timeline[] = [
            'type' => 'created',
            'title' => 'Lead Submitted',
            'description' => 'Your property management request was submitted',
            'timestamp' => $lead->created_at,
            'icon' => 'document',
        ];

        // Assignments
        $assignments = LeadAssignment::where('lead_id', $leadId)
            ->with(['manager:id,name'])
            ->orderBy('created_at', 'asc')
            ->get();

        foreach ($assignments as $assignment) {
            // Matched
            $timeline[] = [
                'type' => 'matched',
                'title' => 'Manager Matched',
                'description' => "Matched with {$assignment->manager->name} (Score: {$assignment->match_score}%)",
                'timestamp' => $assignment->created_at,
                'icon' => 'user-plus',
            ];

            // Contacted
            if ($assignment->contacted_at) {
                $timeline[] = [
                    'type' => 'contacted',
                    'title' => 'Manager Viewed',
                    'description' => "{$assignment->manager->name} viewed your lead details",
                    'timestamp' => $assignment->contacted_at,
                    'icon' => 'eye',
                ];
            }

            // Accepted
            if ($assignment->responded_at && $assignment->status === 'accepted') {
                $timeline[] = [
                    'type' => 'accepted',
                    'title' => 'Manager Accepted',
                    'description' => "{$assignment->manager->name} accepted your lead",
                    'timestamp' => $assignment->responded_at,
                    'icon' => 'check-circle',
                ];
            }
        }

        // Sort by timestamp
        usort($timeline, function ($a, $b) {
            return strtotime($a['timestamp']) - strtotime($b['timestamp']);
        });

        return $timeline;
    }
}
