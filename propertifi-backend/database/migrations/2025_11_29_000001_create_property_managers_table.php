<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('property_managers', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('name');
            $table->string('slug')->unique();

            // Location
            $table->string('address');
            $table->string('city', 100);
            $table->string('state', 50);
            $table->string('zip_code', 20)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            // Contact Information
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();

            // Company Details
            $table->text('description')->nullable();
            $table->string('years_in_business')->nullable();
            $table->string('rentals_managed')->nullable();

            // Ratings & Reviews
            $table->string('bbb_rating', 10)->nullable();
            $table->integer('bbb_review_count')->default(0);

            // Pricing
            $table->string('management_fee')->nullable();
            $table->string('tenant_placement_fee')->nullable();
            $table->string('lease_renewal_fee')->nullable();
            $table->text('miscellaneous_fees')->nullable();

            // Platform Features
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(true);
            $table->string('logo_url')->nullable();
            $table->enum('subscription_tier', ['free', 'premium', 'enterprise'])->default('free');

            // Source Tracking
            $table->string('source_city')->nullable();
            $table->string('source_state')->nullable();
            $table->string('source_url')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['state', 'city']);
            $table->index('is_featured');
            $table->index('subscription_tier');
            $table->index(['latitude', 'longitude']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_managers');
    }
};
