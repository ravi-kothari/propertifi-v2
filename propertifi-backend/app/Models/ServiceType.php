<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Boot method to automatically generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($serviceType) {
            if (empty($serviceType->slug)) {
                $serviceType->slug = Str::slug($serviceType->name);
            }
        });
    }

    /**
     * Get the property managers that offer this service type
     */
    public function propertyManagers()
    {
        return $this->belongsToMany(PropertyManager::class);
    }
}
