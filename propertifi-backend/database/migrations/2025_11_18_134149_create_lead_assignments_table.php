<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeadAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lead_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->onDelete('cascade');
            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');
            $table->decimal('distance_miles', 8, 2)->nullable()->comment('Distance from manager service area center to lead in miles');
            $table->decimal('match_score', 5, 2)->default(0)->comment('Overall match score (0-100)');
            $table->enum('status', ['pending', 'contacted', 'accepted', 'rejected'])->default('pending');
            $table->timestamp('contacted_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['lead_id', 'status']);
            $table->index(['manager_id', 'status']);
            $table->index('match_score');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lead_assignments');
    }
}
