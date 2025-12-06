<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadMatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'property_manager_id',
        'match_score',
        'score_breakdown',
        'available_at',
        'status',
        'viewed_at',
        'responded_at',
        'response_message',
    ];

    protected $casts = [
        'match_score' => 'integer',
        'score_breakdown' => 'array',
        'available_at' => 'datetime',
        'viewed_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    /**
     * Get the lead for this match
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the property manager for this match
     */
    public function propertyManager()
    {
        return $this->belongsTo(PropertyManager::class);
    }

    /**
     * Scope for high-quality matches (score >= 70)
     */
    public function scopeQualityMatches($query)
    {
        return $query->where('match_score', '>=', 70);
    }

    /**
     * Scope for hot matches (score >= 90)
     */
    public function scopeHotMatches($query)
    {
        return $query->where('match_score', '>=', 90);
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for available matches (based on tier access time)
     */
    public function scopeAvailable($query)
    {
        return $query->where('available_at', '<=', now());
    }

    /**
     * Mark match as viewed
     */
    public function markAsViewed()
    {
        $this->update([
            'status' => 'viewed',
            'viewed_at' => now(),
        ]);
    }

    /**
     * Mark match as responded
     */
    public function markAsResponded($message = null)
    {
        $this->update([
            'status' => 'responded',
            'responded_at' => now(),
            'response_message' => $message,
        ]);
    }

    /**
     * Check if match is a hot lead (90+ score)
     */
    public function isHotLead()
    {
        return $this->match_score >= 90;
    }

    /**
     * Check if match meets quality threshold (70+ score)
     */
    public function isQualityMatch()
    {
        return $this->match_score >= 70;
    }
}
