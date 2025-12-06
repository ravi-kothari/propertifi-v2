<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'state',
        'slug',
        'property_manager_count',
    ];

    protected $casts = [
        'property_manager_count' => 'integer',
    ];

    /**
     * Boot method to automatically generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($location) {
            if (empty($location->slug)) {
                // Format: california-san-diego
                $location->slug = Str::slug($location->state . '-' . $location->city);
            }
        });
    }

    /**
     * Get property managers in this location
     */
    public function propertyManagers()
    {
        return PropertyManager::where('city', $this->city)
            ->where('state', $this->state)
            ->get();
    }

    /**
     * Update the property manager count for this location
     */
    public function updatePropertyManagerCount()
    {
        $this->property_manager_count = PropertyManager::where('city', $this->city)
            ->where('state', $this->state)
            ->count();
        $this->save();
    }

    /**
     * Scope for filtering by state
     */
    public function scopeInState($query, $state)
    {
        return $query->where('state', $state);
    }
}
