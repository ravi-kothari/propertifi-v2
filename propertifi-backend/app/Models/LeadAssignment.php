<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadAssignment extends Model
{
    protected $fillable = [
        'lead_id',
        'manager_id',
        'distance_miles',
        'match_score',
        'status',
        'available_at',
        'contacted_at',
        'responded_at',
        'notes',
    ];

    protected $casts = [
        'distance_miles' => 'decimal:2',
        'match_score' => 'decimal:2',
        'available_at' => 'datetime',
        'contacted_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    /**
     * Get the lead that this assignment belongs to
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the manager that this assignment belongs to
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Scope for pending assignments
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for accepted assignments
     */
    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }
}
