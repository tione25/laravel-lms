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
        Schema::create('section_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id');
            $table->foreignId('course_section_id');
            $table->unsignedInteger('order')->default(0);
            $table->string('title');
            $table->string('slug');
            $table->string('description')->nullable();
            $table->string('video')->nullable();
            $table->string('type')->default('video');
            $table->string('status')->default('draft');
            $table->boolean('is_quiz')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_lessons');
    }
};
