<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\UserLeads;
use App\Services\LeadScoringService;
use Illuminate\Http\Request;

class LeadScoringController extends Controller
{
    protected LeadScoringService $scoringService;

    public function __construct(LeadScoringService $scoringService)
    {
        $this->scoringService = $scoringService;
    }

    /**
     * Get AI score for a specific lead
     *
     * GET /api/v2/leads/{leadId}/score
     */
    public function getLeadScore(Request $request, $leadId)
    {
        $user = $request->user();
        $lead = Lead::findOrFail($leadId);

        // Ensure user has access to this lead using Policy
        $this->authorize('view', $lead);

        $score = $this->scoringService->scoreLead($lead, $user);

        return response()->json([
            'success' => true,
            'data' => [
                'lead_id' => $lead->id,
                'score' => $score['score'],
                'tier' => $score['tier'],
                'badge' => $score['badge'],
                'reasons' => $score['reasons'],
                'breakdown' => $score['breakdown'],
            ]
        ]);
    }

    /**
     * Get AI scores for all leads of current PM
     *
     * GET /api/v2/leads/scores
     */
    public function getMyLeadScores(Request $request)
    {
        $user = $request->user();

        // Get all leads for this PM
        // Using with('lead') to optimize query count
        $userLeads = UserLeads::where('user_id', $user->id)
            ->with('lead')
            ->get();

        $scoredLeads = [];

        foreach ($userLeads as $userLead) {
            if ($userLead->lead) {
                $score = $this->scoringService->scoreLead($userLead->lead, $user);

                $scoredLeads[] = [
                    'id' => $userLead->lead->id,
                    'user_lead_id' => $userLead->id,
                    'property_type' => $userLead->lead->property_type,
                    'address' => $userLead->lead->address,
                    'city' => $userLead->lead->city,
                    'state' => $userLead->lead->state,
                    'zipcode' => $userLead->lead->zipcode,
                    'number_of_units' => $userLead->lead->number_of_units,
                    'status' => $userLead->status,
                    'score' => $score['score'],
                    'tier' => $score['tier'],
                    'badge' => $score['badge'],
                    'reasons' => $score['reasons'],
                    'distributed_at' => $userLead->distributed_at,
                ];
            }
        }

        // Sort by score descending
        usort($scoredLeads, function($a, $b) {
            return $b['score'] - $a['score'];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'leads' => $scoredLeads,
                'total' => count($scoredLeads),
            ]
        ]);
    }
}