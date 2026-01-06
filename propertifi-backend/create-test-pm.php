<?php

/**
 * Create Test Property Manager User for Dashboard Testing
 * Run with: php create-test-pm.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "\n========================================\n";
echo "Creating Test Property Manager User\n";
echo "========================================\n\n";

$pmEmail = 'testpm@propertifi.com';
$pmPassword = 'testpm123';
$pmName = 'Test Property Manager';
$companyName = 'Test PM Company';

// Check if PM exists
$existingPM = DB::table('users')->where('email', $pmEmail)->first();

if ($existingPM) {
    echo "✓ Test PM user already exists\n";
    echo "  ID: {$existingPM->id}\n";
    echo "  Name: {$existingPM->name}\n";
    echo "  Email: {$existingPM->email}\n";

    // Update to ensure it's PM type and verified
    DB::table('users')
        ->where('id', $existingPM->id)
        ->update([
            'type' => 'pm',
            'status' => 1,
            'is_verified' => 1,
            'company_name' => $companyName,
            'updated_at' => now(),
        ]);
    echo "✓ Updated user type to 'pm'\n";
    $pmId = $existingPM->id;
} else {
    // Create new PM user
    $pmId = DB::table('users')->insertGetId([
        'name' => $pmName,
        'email' => $pmEmail,
        'password' => Hash::make($pmPassword),
        'type' => 'pm',
        'company_name' => $companyName,
        'status' => 1,
        'is_verified' => 1,
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "✓ Test PM user created successfully\n";
    echo "  ID: {$pmId}\n";
    echo "  Name: {$pmName}\n";
    echo "  Email: {$pmEmail}\n";
}

// Check if preferences exist, create if not
$existingPrefs = DB::table('user_preferences')->where('user_id', $pmId)->first();
if (!$existingPrefs) {
    DB::table('user_preferences')->insert([
        'user_id' => $pmId,
        'property_types' => json_encode(['Single Family', 'Multi-Family']),
        'service_radius_miles' => 50,
        'email_notifications' => true,
        'sms_notifications' => false,
        'tier_id' => 2, // Assuming 2 = Pro tier
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    echo "✓ Created user preferences\n";
}

echo "\n========================================\n";
echo "Test PM Login Credentials\n";
echo "========================================\n\n";
echo "Email:    {$pmEmail}\n";
echo "Password: {$pmPassword}\n";
echo "\nLogin URL: http://localhost:3000/login?type=manager\n";
echo "\nAfter login, access PM dashboard:\n";
echo "  - Dashboard:    /property-manager\n";
echo "  - Leads:        /property-manager/leads\n";
echo "  - Analytics:    /property-manager/analytics\n";
echo "  - Preferences:  /property-manager/preferences\n";
echo "\n✅ Setup complete!\n\n";
