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
        Schema::create('course_path', function (Blueprint $table) {
            $table->unsignedBigInteger('path_id');
            $table->unsignedBigInteger('path_section_id');
            $table->unsignedBigInteger('course_id');
            $table->unsignedInteger('order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_path');
    }
};
