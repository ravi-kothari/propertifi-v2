<?php

/**
 * Create Admin User for SaaS Dashboard
 * Run with: php create-admin-user.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "\n========================================\n";
echo "Creating Admin User\n";
echo "========================================\n\n";

$adminEmail = 'admin@propertifi.com';
$adminPassword = 'admin123';
$adminName = 'System Administrator';

// Check if admin exists
$existingAdmin = DB::table('users')->where('email', $adminEmail)->first();

if ($existingAdmin) {
    echo "✓ Admin user already exists\n";
    echo "  ID: {$existingAdmin->id}\n";
    echo "  Name: {$existingAdmin->name}\n";
    echo "  Email: {$existingAdmin->email}\n";

    // Update to ensure it's admin type
    DB::table('users')
        ->where('id', $existingAdmin->id)
        ->update([
            'type' => 'admin',
            'status' => 1,
            'is_verified' => 1,
            'updated_at' => now(),
        ]);
    echo "✓ Updated user type to 'admin'\n";
    $adminId = $existingAdmin->id;
} else {
    // Create new admin user
    $adminId = DB::table('users')->insertGetId([
        'name' => $adminName,
        'email' => $adminEmail,
        'password' => Hash::make($adminPassword),
        'type' => 'admin',
        'status' => 1,
        'is_verified' => 1,
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "✓ Admin user created successfully\n";
    echo "  ID: {$adminId}\n";
    echo "  Name: {$adminName}\n";
    echo "  Email: {$adminEmail}\n";
}

echo "\n========================================\n";
echo "Admin Login Credentials\n";
echo "========================================\n\n";
echo "Email:    {$adminEmail}\n";
echo "Password: {$adminPassword}\n";
echo "\nLogin URL: http://localhost:3000/login\n";
echo "\nAfter login, access admin pages:\n";
echo "  - Dashboard:        /admin\n";
echo "  - Lead Assignments: /admin/lead-assignments\n";
echo "  - Users:            /admin/users\n";
echo "  - Leads:            /admin/leads\n";
echo "  - Settings:         /admin/settings\n";
echo "\n✅ Setup complete!\n\n";
