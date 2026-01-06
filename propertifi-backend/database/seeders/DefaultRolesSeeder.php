<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Roles;

class DefaultRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin Role - Full permissions
        Roles::updateOrCreate(
            ['name' => 'admin'],
            [
                'title' => 'Administrator',
                'description' => 'Full system access with all permissions',
                'is_admin' => true,
                'status' => 1,
                'permissions' => [
                    'view_users',
                    'create_users',
                    'edit_users',
                    'delete_users',
                    'manage_users',
                    'view_roles',
                    'create_roles',
                    'edit_roles',
                    'delete_roles',
                    'manage_roles',
                    'view_properties',
                    'create_properties',
                    'edit_properties',
                    'delete_properties',
                    'manage_properties',
                    'view_leads',
                    'create_leads',
                    'edit_leads',
                    'delete_leads',
                    'assign_leads',
                    'manage_leads',
                    'view_analytics',
                    'view_reports',
                    'export_reports',
                    'manage_settings',
                    'manage_system_settings',
                    'view_billing',
                    'manage_billing',
                    'view_invoices',
                    'view_support_tickets',
                    'manage_support_tickets',
                    'view_marketplace',
                    'manage_marketplace',
                ]
            ]
        );

        // Property Manager Role
        Roles::updateOrCreate(
            ['name' => 'property_manager'],
            [
                'title' => 'Property Manager',
                'description' => 'Manage properties and related operations',
                'is_admin' => false,
                'is_default' => false,
                'status' => 1,
                'permissions' => [
                    'view_properties',
                    'create_properties',
                    'edit_properties',
                    'manage_properties',
                    'view_leads',
                    'create_leads',
                    'edit_leads',
                    'assign_leads',
                    'view_analytics',
                    'view_reports',
                    'view_support_tickets',
                    'view_marketplace',
                ]
            ]
        );

        // Property Owner Role
        Roles::updateOrCreate(
            ['name' => 'owner'],
            [
                'title' => 'Property Owner',
                'description' => 'View and manage own properties',
                'is_admin' => false,
                'is_default' => true,
                'status' => 1,
                'permissions' => [
                    'view_properties',
                    'edit_properties',
                    'view_analytics',
                    'view_reports',
                    'view_billing',
                    'view_invoices',
                    'view_support_tickets',
                    'view_marketplace',
                ]
            ]
        );

        // Basic User Role
        Roles::updateOrCreate(
            ['name' => 'user'],
            [
                'title' => 'User',
                'description' => 'Basic user with limited permissions',
                'is_admin' => false,
                'is_default' => false,
                'status' => 1,
                'permissions' => [
                    'view_properties',
                    'view_marketplace',
                ]
            ]
        );

        // Account Manager Role
        Roles::updateOrCreate(
            ['name' => 'account_manager'],
            [
                'title' => 'Account Manager',
                'description' => 'Manage user accounts and customer relations',
                'is_admin' => false,
                'status' => 1,
                'permissions' => [
                    'view_users',
                    'create_users',
                    'edit_users',
                    'view_properties',
                    'view_leads',
                    'create_leads',
                    'edit_leads',
                    'assign_leads',
                    'manage_leads',
                    'view_analytics',
                    'view_reports',
                    'view_support_tickets',
                    'manage_support_tickets',
                ]
            ]
        );

        $this->command->info('Default roles with permissions have been seeded successfully!');
    }
}
