<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedCalculation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavedCalculationController extends Controller
{
    /**
     * Get all saved calculations for the authenticated user
     */
    public function index(Request $request)
    {
        $query = SavedCalculation::where('user_id', Auth::id());

        // Filter by calculator type if provided
        if ($request->has('calculator_type')) {
            $query->where('calculator_type', $request->calculator_type);
        }

        $calculations = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'calculations' => $calculations
        ]);
    }

    /**
     * Get a specific saved calculation
     */
    public function show(SavedCalculation $savedCalculation)
    {
        // Ensure user owns this calculation
        if ($savedCalculation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'calculation' => $savedCalculation
        ]);
    }

    /**
     * Save a new calculation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'calculator_type' => 'required|string|in:roi,pm-fee,rent-estimate,rehab-cost',
            'name' => 'nullable|string|max:255',
            'input_data' => 'required|array',
            'result_data' => 'nullable|array',
        ]);

        $calculation = SavedCalculation::create([
            'user_id' => Auth::id(),
            'calculator_type' => $validated['calculator_type'],
            'name' => $validated['name'] ?? $this->generateDefaultName($validated['calculator_type']),
            'input_data' => $validated['input_data'],
            'result_data' => $validated['result_data'] ?? null,
        ]);

        return response()->json([
            'message' => 'Calculation saved successfully',
            'calculation' => $calculation
        ], 201);
    }

    /**
     * Update a saved calculation
     */
    public function update(Request $request, SavedCalculation $savedCalculation)
    {
        // Ensure user owns this calculation
        if ($savedCalculation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'input_data' => 'nullable|array',
            'result_data' => 'nullable|array',
        ]);

        $savedCalculation->update($validated);

        return response()->json([
            'message' => 'Calculation updated successfully',
            'calculation' => $savedCalculation
        ]);
    }

    /**
     * Delete a saved calculation
     */
    public function destroy(SavedCalculation $savedCalculation)
    {
        // Ensure user owns this calculation
        if ($savedCalculation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $savedCalculation->delete();

        return response()->json([
            'message' => 'Calculation deleted successfully'
        ]);
    }

    /**
     * Generate a default name for a calculation
     */
    private function generateDefaultName($calculatorType)
    {
        $names = [
            'roi' => 'ROI Analysis',
            'pm-fee' => 'PM Fee Estimate',
            'rent-estimate' => 'Rent Estimate',
            'rehab-cost' => 'Rehab Cost Estimate',
        ];

        $baseName = $names[$calculatorType] ?? 'Calculation';
        $date = now()->format('M d, Y');

        return "{$baseName} - {$date}";
    }
}
