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
        Schema::create('lead_matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_manager_id')->constrained()->onDelete('cascade');

            // Match scoring
            $table->integer('match_score');
            $table->json('score_breakdown'); // Store the details of the score calculation

            // Tier-based access
            $table->timestamp('available_at'); // For tiered access control

            // Status tracking
            $table->enum('status', ['pending', 'viewed', 'responded', 'won', 'lost'])->default('pending');
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->text('response_message')->nullable();

            $table->timestamps();

            // Ensure uniqueness
            $table->unique(['lead_id', 'property_manager_id']);

            // Indexes for performance
            $table->index('match_score');
            $table->index('status');
            $table->index('available_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_matches');
    }
};
