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
        Schema::create('baggage_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('class_id');
            $table->decimal('free_weight', 5, 2)->default(0);
            $table->decimal('max_weight', 5, 2)->default(0);
            $table->integer('max_length')->nullable(); 
            $table->integer('max_width')->nullable();  
            $table->integer('max_height')->nullable();
            $table->timestamps();

            $table->foreign('class_id')->references('id')->on('seat_classes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baggage_rules');
    }
};
