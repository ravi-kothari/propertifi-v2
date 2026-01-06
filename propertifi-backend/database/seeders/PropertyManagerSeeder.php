<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PropertyManager;
use App\Models\ServiceType;
use Illuminate\Support\Facades\Log;

class PropertyManagerSeeder extends Seeder
{
    /**
     * Import property managers from scraped JSON file.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/property_managers_CA_FL_DC_with_emails.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error("JSON file not found at: {$jsonPath}");
            $this->command->info("Please copy the scraped JSON file to: database/data/");
            return;
        }

        $jsonContent = file_get_contents($jsonPath);
        $propertyManagers = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error("JSON parse error: " . json_last_error_msg());
            return;
        }

        $this->command->info("Found " . count($propertyManagers) . " property managers to import...");

        $imported = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($propertyManagers as $pm) {
            try {
                // Skip if already exists (matching on name + city + state)
                $existing = PropertyManager::where('name', $pm['name'] ?? '')
                    ->where('city', $pm['city'] ?? '')
                    ->where('state', $pm['state'] ?? '')
                    ->first();

                if ($existing) {
                    // Update with new data if we have more info
                    $this->updatePropertyManager($existing, $pm);
                    $skipped++;
                    continue;
                }

                // Create new property manager
                $propertyManager = PropertyManager::create([
                    'name' => $pm['name'] ?? 'Unknown',
                    'address' => $pm['address'] ?? '',
                    'city' => $pm['city'] ?? $pm['source_city'] ?? '',
                    'state' => $pm['state'] ?? $pm['source_state'] ?? '',
                    'zip_code' => $pm['zip_code'] ?? null,
                    'phone' => $this->cleanPhone($pm['phone'] ?? null),
                    'email' => $this->cleanEmail($pm['email'] ?? null),
                    'website' => $pm['website'] ?? null,
                    'description' => $pm['description'] ?? null,
                    'years_in_business' => $pm['years_in_business'] ?? null,
                    'rentals_managed' => $pm['rentals_managed'] ?? null,
                    'bbb_rating' => $pm['bbb_rating'] ?? null,
                    'management_fee' => $pm['management_fee'] ?? null,
                    'tenant_placement_fee' => $pm['tenant_placement_fee'] ?? null,
                    'lease_renewal_fee' => $pm['lease_renewal_fee'] ?? null,
                    'miscellaneous_fees' => $pm['miscellaneous_fees'] ?? null,
                    'source_city' => $pm['source_city'] ?? null,
                    'source_state' => $pm['source_state'] ?? null,
                    'source_url' => $pm['source_url'] ?? null,
                    'is_verified' => true,
                    'is_featured' => $pm['bbb_rating'] === 'A+', // Feature A+ rated
                ]);

                // Handle service types if present
                if (!empty($pm['service_types'])) {
                    $this->attachServiceTypes($propertyManager, $pm['service_types']);
                }

                $imported++;

            } catch (\Exception $e) {
                $errors++;
                Log::error("Error importing PM: {$pm['name']} - " . $e->getMessage());
            }

            // Progress indicator
            if (($imported + $skipped) % 100 === 0) {
                $this->command->info("Processed: " . ($imported + $skipped) . " records...");
            }
        }

        $this->command->newLine();
        $this->command->info("Import completed!");
        $this->command->info("  - Imported: {$imported}");
        $this->command->info("  - Updated: {$skipped}");
        $this->command->info("  - Errors: {$errors}");
    }

    /**
     * Update existing property manager with new data
     */
    private function updatePropertyManager(PropertyManager $pm, array $data): void
    {
        $updates = [];

        // Only update if new data is more complete
        if (empty($pm->management_fee) && !empty($data['management_fee'])) {
            $updates['management_fee'] = $data['management_fee'];
        }
        if (empty($pm->tenant_placement_fee) && !empty($data['tenant_placement_fee'])) {
            $updates['tenant_placement_fee'] = $data['tenant_placement_fee'];
        }
        if (empty($pm->bbb_rating) && !empty($data['bbb_rating'])) {
            $updates['bbb_rating'] = $data['bbb_rating'];
        }
        if (empty($pm->description) && !empty($data['description'])) {
            $updates['description'] = $data['description'];
        }
        if (empty($pm->email) && !empty($data['email'])) {
            $updates['email'] = $this->cleanEmail($data['email']);
        }

        if (!empty($updates)) {
            $pm->update($updates);
        }
    }

    /**
     * Clean phone number (remove extra text)
     */
    private function cleanPhone(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }
        // Extract just the phone number part
        if (preg_match('/[\d\(\)\-\.\s]{10,}/', $phone, $matches)) {
            return trim($matches[0]);
        }
        return $phone;
    }

    /**
     * Clean email (remove extra text that got concatenated)
     */
    private function cleanEmail(?string $email): ?string
    {
        if (empty($email)) {
            return null;
        }
        // Extract just the email part
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $email, $matches)) {
            return strtolower(trim($matches[0]));
        }
        return null;
    }

    /**
     * Attach service types to property manager
     */
    private function attachServiceTypes(PropertyManager $pm, string $serviceTypesStr): void
    {
        $types = explode(',', $serviceTypesStr);
        $typeIds = [];

        foreach ($types as $typeName) {
            $typeName = trim($typeName);
            if (empty($typeName)) continue;

            $serviceType = ServiceType::firstOrCreate(
                ['name' => $typeName],
                ['slug' => \Illuminate\Support\Str::slug($typeName)]
            );
            $typeIds[] = $serviceType->id;
        }

        if (!empty($typeIds)) {
            $pm->serviceTypes()->sync($typeIds);
        }
    }
}
