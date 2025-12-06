<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLocationCoordinatesToUserPreferences extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            // Add latitude and longitude for center point of service area (if not exists)
            if (!Schema::hasColumn('user_preferences', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('service_radius_miles')
                    ->comment('Latitude of business center location');
            }
            if (!Schema::hasColumn('user_preferences', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude')
                    ->comment('Longitude of business center location');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_preferences', function (Blueprint $table) {
            $table->dropIndex(['latitude', 'longitude']);
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
}
