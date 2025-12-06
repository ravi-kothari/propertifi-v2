<?php

namespace App\Console\Commands;

use App\Models\PropertyManager;
use App\Models\ServiceType;
use App\Models\Location;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ImportPropertyManagers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:managers {--skip-geocoding : Skip geocoding addresses} {--states=* : Limit import to specific states (e.g., CA,FL,DC)} {--limit= : Limit number of companies to import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import property managers from JSON file with geocoding';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting property manager import...');

        // Check if JSON file exists
        $jsonPath = base_path('../scraper/property_managers_CA_FL_DC_with_emails.json');
        if (!file_exists($jsonPath)) {
            $this->error("JSON file not found at: {$jsonPath}");
            return 1;
        }

        // Load JSON data
        $this->info('Loading JSON data...');
        $jsonData = json_decode(file_get_contents($jsonPath), true);

        if (!$jsonData || !is_array($jsonData)) {
            $this->error('Invalid JSON format');
            return 1;
        }

        // Handle both array formats: direct array or wrapped in 'companies' key
        $companies = isset($jsonData['companies']) ? $jsonData['companies'] : $jsonData;

        // Filter by states if specified
        $states = $this->option('states');
        if (!empty($states)) {
            // Flatten array if states passed as comma-separated
            if (count($states) === 1 && strpos($states[0], ',') !== false) {
                $states = explode(',', $states[0]);
            }
            $states = array_map('strtoupper', array_map('trim', $states));

            $companies = array_filter($companies, function($company) use ($states) {
                $companyState = strtoupper($this->normalizeState($company['state'] ?? ''));
                return in_array($companyState, $states);
            });
            $companies = array_values($companies); // Re-index array
            $this->info("Filtered to states: " . implode(', ', $states));
        }

        // Limit number of companies if specified
        $limit = $this->option('limit');
        if ($limit) {
            $companies = array_slice($companies, 0, (int)$limit);
            $this->info("Limited to first {$limit} companies");
        }

        $totalCompanies = count($companies);
        $this->info("Found {$totalCompanies} companies to import");

        // Start transaction
        DB::beginTransaction();

        try {
            // Create service types
            $this->info('Creating service types...');
            $this->createServiceTypes();

            // Import companies with progress bar
            $progressBar = $this->output->createProgressBar($totalCompanies);
            $progressBar->start();

            $imported = 0;
            $skipped = 0;
            $geocoded = 0;

            foreach ($companies as $company) {
                try {
                    $pmData = $this->mapCompanyData($company);

                    // Geocode if not skipping
                    if (!$this->option('skip-geocoding')) {
                        $coordinates = $this->geocodeAddress($pmData['address'], $pmData['city'], $pmData['state']);
                        if ($coordinates) {
                            $pmData['latitude'] = $coordinates['lat'];
                            $pmData['longitude'] = $coordinates['lng'];
                            $geocoded++;
                        }
                    }

                    // Create or update property manager
                    $pm = PropertyManager::updateOrCreate(
                        ['name' => $pmData['name'], 'city' => $pmData['city']],
                        $pmData
                    );

                    // Attach service types (default to Residential for now)
                    $residentialType = ServiceType::where('slug', 'residential')->first();
                    if ($residentialType) {
                        $pm->serviceTypes()->syncWithoutDetaching([$residentialType->id]);
                    }

                    $imported++;
                } catch (\Exception $e) {
                    $this->warn("\nError importing {$company['name']}: " . $e->getMessage());
                    $skipped++;
                }

                $progressBar->advance();
            }

            $progressBar->finish();
            $this->newLine();

            // Update location counts
            $this->info('Updating location counts...');
            $this->updateLocationCounts();

            // Commit transaction
            DB::commit();

            // Display summary
            $this->newLine();
            $this->info('Import completed successfully!');
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Total Companies', $totalCompanies],
                    ['Successfully Imported', $imported],
                    ['Skipped (errors)', $skipped],
                    ['Geocoded', $geocoded],
                    ['With Emails', $this->countWithEmails()],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Import failed: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Create standard service types
     */
    protected function createServiceTypes()
    {
        $types = [
            ['name' => 'Residential', 'slug' => 'residential'],
            ['name' => 'Commercial', 'slug' => 'commercial'],
            ['name' => 'HOA', 'slug' => 'hoa'],
            ['name' => 'Vacation Rentals', 'slug' => 'vacation-rentals'],
        ];

        foreach ($types as $type) {
            ServiceType::firstOrCreate(['slug' => $type['slug']], $type);
        }
    }

    /**
     * Map company data from JSON to database fields
     */
    protected function mapCompanyData(array $company): array
    {
        return [
            'name' => $company['name'] ?? 'Unknown',
            'address' => $company['address'] ?? '',
            'city' => $company['city'] ?? '',
            'state' => $this->normalizeState($company['state'] ?? ''),
            'zip_code' => $company['zip_code'] ?? null,
            'phone' => $company['phone'] ?? null,
            'email' => $company['email'] ?? null,
            'website' => $company['website'] ?? null,
            'description' => $company['description'] ?? null,
            'years_in_business' => $company['years_in_business'] ?? null,
            'rentals_managed' => $company['rentals_managed'] ?? null,
            'bbb_rating' => $company['bbb_rating'] ?? null,
            'bbb_review_count' => 0, // Not in JSON, will need to extract from bbb_rating if needed
            'management_fee' => $company['management_fee'] ?? null,
            'tenant_placement_fee' => $company['tenant_placement_fee'] ?? null,
            'lease_renewal_fee' => $company['lease_renewal_fee'] ?? null,
            'miscellaneous_fees' => $company['miscellaneous_fees'] ?? null,
            'is_featured' => false,
            'is_verified' => true,
            'subscription_tier' => 'free',
            'source_city' => $company['source_city'] ?? null,
            'source_state' => $company['source_state'] ?? null,
            'source_url' => $company['source_url'] ?? null,
        ];
    }

    /**
     * Normalize state names to abbreviations
     */
    protected function normalizeState(string $state): string
    {
        $stateMap = [
            'california' => 'CA',
            'florida' => 'FL',
            'district of columbia' => 'DC',
        ];

        return $stateMap[strtolower($state)] ?? strtoupper(substr($state, 0, 2));
    }

    /**
     * Geocode an address using Google Maps API
     */
    protected function geocodeAddress(string $address, string $city, string $state): ?array
    {
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        if (!$apiKey) {
            return null;
        }

        try {
            $fullAddress = "{$address}, {$city}, {$state}";
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'address' => $fullAddress,
                'key' => $apiKey,
            ]);

            if ($response->successful() && $response['status'] === 'OK') {
                $location = $response['results'][0]['geometry']['location'];
                return [
                    'lat' => $location['lat'],
                    'lng' => $location['lng'],
                ];
            }

            // Rate limiting - sleep for a bit
            usleep(100000); // 100ms delay

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Update location counts for all cities
     */
    protected function updateLocationCounts()
    {
        $locations = DB::table('property_managers')
            ->select('city', 'state', DB::raw('COUNT(*) as count'))
            ->groupBy('city', 'state')
            ->get();

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['city' => $location->city, 'state' => $location->state],
                ['property_manager_count' => $location->count]
            );
        }
    }

    /**
     * Count property managers with emails
     */
    protected function countWithEmails(): int
    {
        return PropertyManager::whereNotNull('email')
            ->where('email', '!=', '')
            ->count();
    }
}
