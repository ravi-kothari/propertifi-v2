<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PropertyManager extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'phone',
        'email',
        'website',
        'description',
        'years_in_business',
        'rentals_managed',
        'bbb_rating',
        'bbb_review_count',
        'management_fee',
        'tenant_placement_fee',
        'lease_renewal_fee',
        'miscellaneous_fees',
        'is_featured',
        'is_verified',
        'logo_url',
        'subscription_tier',
        'source_city',
        'source_state',
        'source_url',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_featured' => 'boolean',
        'is_verified' => 'boolean',
        'bbb_review_count' => 'integer',
    ];

    /**
     * Boot method to automatically generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($propertyManager) {
            if (empty($propertyManager->slug)) {
                $propertyManager->slug = Str::slug($propertyManager->name);

                // Ensure uniqueness
                $count = static::where('slug', 'LIKE', $propertyManager->slug . '%')->count();
                if ($count > 0) {
                    $propertyManager->slug = $propertyManager->slug . '-' . ($count + 1);
                }
            }
        });
    }

    /**
     * Get the service types for this property manager
     */
    public function serviceTypes()
    {
        return $this->belongsToMany(ServiceType::class);
    }

    /**
     * Get the lead matches for this property manager
     */
    public function leadMatches()
    {
        return $this->hasMany(LeadMatch::class);
    }

    /**
     * Scope for filtering by city
     */
    public function scopeInCity($query, $city)
    {
        return $query->where('city', $city);
    }

    /**
     * Scope for filtering by state
     */
    public function scopeInState($query, $state)
    {
        return $query->where('state', $state);
    }

    /**
     * Scope for featured property managers
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for verified property managers
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope for filtering by subscription tier
     */
    public function scopeTier($query, $tier)
    {
        return $query->where('subscription_tier', $tier);
    }

    /**
     * Calculate distance from a given point (in miles)
     */
    public function distanceFrom($latitude, $longitude)
    {
        if (!$this->latitude || !$this->longitude) {
            return null;
        }

        $earthRadius = 3959; // miles

        $dLat = deg2rad($latitude - $this->latitude);
        $dLon = deg2rad($longitude - $this->longitude);

        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($this->latitude)) * cos(deg2rad($latitude)) *
             sin($dLon/2) * sin($dLon/2);

        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        return round($distance, 2);
    }

    /**
     * Get property managers within a certain radius
     */
    public static function withinRadius($latitude, $longitude, $radiusMiles = 25)
    {
        return static::all()->filter(function ($pm) use ($latitude, $longitude, $radiusMiles) {
            $distance = $pm->distanceFrom($latitude, $longitude);
            return $distance !== null && $distance <= $radiusMiles;
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
