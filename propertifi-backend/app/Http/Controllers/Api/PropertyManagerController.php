<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PropertyManager;
use Illuminate\Http\Request;

class PropertyManagerController extends Controller
{
    /**
     * Get list of property managers for Next.js frontend
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = PropertyManager::query();

        // Filter by state if provided
        if ($request->has('state') && $request->state != '') {
            $query->where('state', strtoupper($request->state));
        }

        // Filter by city if provided
        if ($request->has('city') && $request->city != '') {
            $query->where('city', 'LIKE', '%' . $request->city . '%');
        }

        // Filter by verified status if provided
        if ($request->has('verified')) {
            $query->where('is_verified', $request->verified == 'true' ? 1 : 0);
        }

        // Search by name (company name)
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');

        // Prioritize featured and verified PMs
        $query->orderBy('is_featured', 'desc')
            ->orderBy('is_verified', 'desc')
            ->orderBy($sortBy, $sortOrder);

        $managers = $query->paginate($request->input('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $managers
        ]);
    }

    /**
     * Get single PM details by slug (simplified for Next.js)
     *
     * @param  string  $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBySlug($slug)
    {
        $manager = PropertyManager::where('slug', $slug)->first();

        if (!$manager) {
            return response()->json([
                'success' => false,
                'message' => 'Property manager not found'
            ], 404);
        }

        // Get related PMs in the same city (limit 3)
        $relatedManagers = PropertyManager::where('city', $manager->city)
            ->where('state', $manager->state)
            ->where('id', '!=', $manager->id)
            ->orderBy('is_featured', 'desc')
            ->orderBy('bbb_rating', 'desc')
            ->limit(3)
            ->get(['id', 'name', 'slug', 'bbb_rating', 'logo_url', 'management_fee']);

        return response()->json(array_merge($manager->toArray(), [
            'related_managers' => $relatedManagers
        ]));
    }

    /**
     * Get PMs by city for directory listing
     *
     * @param  string  $state
     * @param  string  $city
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByCity($state, $city)
    {
        // Convert city slug to proper format (e.g., "los-angeles" -> "Los Angeles")
        $cityName = str_replace('-', ' ', $city);
        $cityName = ucwords($cityName);

        $managers = PropertyManager::where('state', strtoupper($state))
            ->where('city', 'LIKE', '%' . $cityName . '%')
            ->orderBy('is_featured', 'desc')
            ->orderBy('bbb_rating', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'city' => $cityName,
            'state' => strtoupper($state),
            'count' => $managers->count(),
            'data' => $managers
        ]);
    }

    /**
     * Get single PM details by slug with state/city context
     *
     * @param  string  $state
     * @param  string  $city
     * @param  string  $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($state, $city, $slug)
    {
        $manager = PropertyManager::where('slug', $slug)->first();

        if (!$manager) {
            return response()->json([
                'success' => false,
                'message' => 'Property manager not found'
            ], 404);
        }

        // Get related PMs in the same city (limit 3)
        $relatedManagers = PropertyManager::where('city', $manager->city)
            ->where('state', $manager->state)
            ->where('id', '!=', $manager->id)
            ->orderBy('is_featured', 'desc')
            ->orderBy('bbb_rating', 'desc')
            ->limit(3)
            ->get(['id', 'name', 'slug', 'bbb_rating', 'logo_url', 'management_fee']);

        return response()->json([
            'success' => true,
            'data' => $manager,
            'related_managers' => $relatedManagers
        ]);
    }

    /**
     * Get PM details by ID
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getById($id)
    {
        $manager = PropertyManager::find($id);

        if (!$manager) {
            return response()->json([
                'success' => false,
                'message' => 'Property manager not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $manager
        ]);
    }

    /**
     * Get list of cities with PM counts by state
     *
     * @param  string  $state
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCitiesByState($state)
    {
        $cities = PropertyManager::where('state', strtoupper($state))
            ->selectRaw('city, COUNT(*) as manager_count')
            ->groupBy('city')
            ->orderBy('manager_count', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'state' => strtoupper($state),
            'data' => $cities
        ]);
    }
}

