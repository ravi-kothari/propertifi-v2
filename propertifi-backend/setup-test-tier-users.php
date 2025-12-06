<?php

/**
 * Test Setup Script: Create PM users with different tier subscriptions
 * Run with: php setup-test-tier-users.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "\n========================================\n";
echo "Creating Test PM Users with Tiers\n";
echo "========================================\n\n";

// Get tier IDs
$freeTier = DB::table('tiers')->where('name', 'free')->first();
$premiumTier = DB::table('tiers')->where('name', 'premium')->first();
$enterpriseTier = DB::table('tiers')->where('name', 'enterprise')->first();

echo "Tier IDs:\n";
echo "  Free: {$freeTier->id}\n";
echo "  Premium: {$premiumTier->id}\n";
echo "  Enterprise: {$enterpriseTier->id}\n\n";

// Test users configuration
$testUsers = [
    [
        'name' => 'Free Tier PM',
        'email' => 'pm-free@test.com',
        'tier_id' => $freeTier->id,
        'tier_name' => 'Free',
    ],
    [
        'name' => 'Premium Tier PM',
        'email' => 'pm-premium@test.com',
        'tier_id' => $premiumTier->id,
        'tier_name' => 'Premium (24h)',
    ],
    [
        'name' => 'Enterprise Tier PM',
        'email' => 'pm-enterprise@test.com',
        'tier_id' => $enterpriseTier->id,
        'tier_name' => 'Enterprise (48h)',
    ],
];

foreach ($testUsers as $userData) {
    echo "Creating {$userData['tier_name']} user: {$userData['email']}\n";

    // Check if user exists
    $existingUser = DB::table('users')->where('email', $userData['email'])->first();

    if ($existingUser) {
        echo "  ✓ User already exists (ID: {$existingUser->id})\n";
        $userId = $existingUser->id;
    } else {
        // Create user
        $userId = DB::table('users')->insertGetId([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make('password123'),
            'type' => 'pm',
            'status' => 1,
            'is_verified' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "  ✓ User created (ID: {$userId})\n";
    }

    // Check if preferences exist
    $existingPrefs = DB::table('user_preferences')->where('user_id', $userId)->first();

    if ($existingPrefs) {
        // Update tier
        DB::table('user_preferences')
            ->where('user_id', $userId)
            ->update([
                'tier_id' => $userData['tier_id'],
                'is_active' => true,
                'updated_at' => now(),
            ]);
        echo "  ✓ Preferences updated with tier\n";
    } else {
        // Create preferences (Phoenix, AZ area)
        DB::table('user_preferences')->insert([
            'user_id' => $userId,
            'tier_id' => $userData['tier_id'],
            'is_active' => true,
            'property_types' => json_encode(['single-family', 'multi-family', 'commercial']),
            'min_units' => 1,
            'max_units' => 100,
            'latitude' => 33.4484,  // Phoenix, AZ
            'longitude' => -112.0740,
            'service_radius_miles' => 50,
            'email_notifications' => true,
            'sms_notifications' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "  ✓ Preferences created\n";
    }

    echo "\n";
}

echo "========================================\n";
echo "Test Users Summary\n";
echo "========================================\n\n";

$users = DB::table('users')
    ->join('user_preferences', 'users.id', '=', 'user_preferences.user_id')
    ->leftJoin('tiers', 'user_preferences.tier_id', '=', 'tiers.id')
    ->whereIn('users.email', ['pm-free@test.com', 'pm-premium@test.com', 'pm-enterprise@test.com'])
    ->select(
        'users.id',
        'users.name',
        'users.email',
        'tiers.name as tier',
        'tiers.exclusivity_hours'
    )
    ->get();

foreach ($users as $user) {
    echo sprintf(
        "ID: %d | %-20s | %-25s | %-15s | %2dh exclusivity\n",
        $user->id,
        $user->name,
        $user->email,
        $user->tier ?? 'No tier',
        $user->exclusivity_hours ?? 0
    );
}

echo "\n✅ Setup complete! You can now test with these credentials:\n";
echo "   Email: pm-free@test.com         | Password: password123 (Free tier - 0h exclusivity)\n";
echo "   Email: pm-premium@test.com      | Password: password123 (Premium - 24h exclusivity)\n";
echo "   Email: pm-enterprise@test.com   | Password: password123 (Enterprise - 48h exclusivity)\n";
echo "\n";
