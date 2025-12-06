<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAvailableAtToLeadAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lead_assignments', function (Blueprint $table) {
            $table->timestamp('available_at')->nullable()->after('status')
                ->comment('Timestamp when the lead becomes available to this manager based on their tier');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lead_assignments', function (Blueprint $table) {
            $table->dropColumn('available_at');
        });
    }
}
