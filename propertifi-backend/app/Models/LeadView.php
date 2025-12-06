<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadView extends Model
{
    protected $fillable = [
        'lead_id',
        'manager_id',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the lead that was viewed
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the manager who viewed the lead
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
