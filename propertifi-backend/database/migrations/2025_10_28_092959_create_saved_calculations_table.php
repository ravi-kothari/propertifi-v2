<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSavedCalculationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('saved_calculations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('calculator_type'); // roi, pm-fee, rent-estimate, rehab-cost
            $table->string('name')->nullable(); // User-friendly name for the calculation
            $table->json('input_data'); // All calculator inputs
            $table->json('result_data')->nullable(); // Calculated results
            $table->timestamps();

            // Index for faster queries
            $table->index(['user_id', 'calculator_type']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('saved_calculations');
    }
}
