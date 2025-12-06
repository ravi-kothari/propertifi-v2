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
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "Residential", "Commercial", "HOA"
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // Pivot table for many-to-many relationship
        Schema::create('property_manager_service_type', function (Blueprint $table) {
            $table->foreignId('property_manager_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_type_id')->constrained()->onDelete('cascade');
            $table->primary(['property_manager_id', 'service_type_id'], 'pm_service_type_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_manager_service_type');
        Schema::dropIfExists('service_types');
    }
};
