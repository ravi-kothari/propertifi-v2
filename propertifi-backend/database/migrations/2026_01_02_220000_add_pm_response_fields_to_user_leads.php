<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_leads', function (Blueprint $table) {
            // PM Response tracking fields
            $table->timestamp('responded_at')->nullable()->after('viewed_at');
            $table->text('response_notes')->nullable()->after('responded_at');
            $table->enum('response_type', ['interested', 'not_interested', 'contacted', 'declined'])->nullable()->after('response_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_leads', function (Blueprint $table) {
            $table->dropColumn(['responded_at', 'response_notes', 'response_type']);
        });
    }
};
