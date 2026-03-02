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
        Schema::create('thank_you_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contribution_id')->constrained()->onDelete('cascade');
            $table->string('video_url');
            $table->timestamp('watched_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thank_you_videos');
    }
};
