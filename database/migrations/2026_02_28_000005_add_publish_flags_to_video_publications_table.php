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
        Schema::table('video_publications', function (Blueprint $table) {
            $table->boolean('publish_to_facebook')->default(false)->after('instagram_status');
            $table->boolean('publish_to_instagram')->default(false)->after('publish_to_facebook');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('video_publications', function (Blueprint $table) {
            $table->dropColumn(['publish_to_facebook', 'publish_to_instagram']);
        });
    }
};
