<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class GeocodingService
{
    private $apiKey;
    private $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    /**
     * Geocode an address to latitude and longitude
     *
     * @param string $address Full address string
     * @param string|null $city City
     * @param string|null $state State
     * @param string|null $zipcode Zip code
     * @return array|null Returns ['lat' => float, 'lng' => float] or null on failure
     */
    public function geocode($address, $city = null, $state = null, $zipcode = null)
    {
        if (empty($this->apiKey)) {
            Log::error('Google Maps API key not configured');
            return null;
        }

        // Build full address
        $fullAddress = $this->buildFullAddress($address, $city, $state, $zipcode);

        // Create cache key
        $cacheKey = 'geocode_' . md5($fullAddress);

        // Check cache first (cache for 30 days)
        return Cache::remember($cacheKey, 60 * 60 * 24 * 30, function () use ($fullAddress) {
            return $this->performGeocode($fullAddress);
        });
    }

    /**
     * Perform the actual geocoding API call
     *
     * @param string $address Full address string
     * @return array|null
     */
    private function performGeocode($address)
    {
        try {
            $response = Http::get($this->baseUrl, [
                'address' => $address,
                'key' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                Log::error('Geocoding API request failed', [
                    'status' => $response->status(),
                    'address' => $address
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['status'] !== 'OK' || empty($data['results'])) {
                Log::warning('Geocoding failed', [
                    'status' => $data['status'],
                    'address' => $address
                ]);
                return null;
            }

            $location = $data['results'][0]['geometry']['location'];

            return [
                'lat' => $location['lat'],
                'lng' => $location['lng'],
                'formatted_address' => $data['results'][0]['formatted_address'] ?? null
            ];

        } catch (\Exception $e) {
            Log::error('Geocoding exception', [
                'message' => $e->getMessage(),
                'address' => $address
            ]);
            return null;
        }
    }

    /**
     * Build a full address string from components
     *
     * @param string $address Street address
     * @param string|null $city City
     * @param string|null $state State
     * @param string|null $zipcode Zip code
     * @return string
     */
    private function buildFullAddress($address, $city = null, $state = null, $zipcode = null)
    {
        $parts = array_filter([$address, $city, $state, $zipcode]);
        return implode(', ', $parts);
    }

    /**
     * Reverse geocode coordinates to an address
     *
     * @param float $lat Latitude
     * @param float $lng Longitude
     * @return array|null
     */
    public function reverseGeocode($lat, $lng)
    {
        if (empty($this->apiKey)) {
            Log::error('Google Maps API key not configured');
            return null;
        }

        $cacheKey = 'reverse_geocode_' . md5($lat . '_' . $lng);

        return Cache::remember($cacheKey, 60 * 60 * 24 * 30, function () use ($lat, $lng) {
            try {
                $response = Http::get($this->baseUrl, [
                    'latlng' => "$lat,$lng",
                    'key' => $this->apiKey,
                ]);

                if (!$response->successful()) {
                    return null;
                }

                $data = $response->json();

                if ($data['status'] !== 'OK' || empty($data['results'])) {
                    return null;
                }

                return [
                    'formatted_address' => $data['results'][0]['formatted_address'],
                    'address_components' => $data['results'][0]['address_components']
                ];

            } catch (\Exception $e) {
                Log::error('Reverse geocoding exception', ['message' => $e->getMessage()]);
                return null;
            }
        });
    }
}
