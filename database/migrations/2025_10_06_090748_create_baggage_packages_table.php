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
        Schema::create('baggage_packages', function (Blueprint $table) {
            $table->id();
            $table->decimal('weight', 5, 2); 
            $table->decimal('price', 10, 2); 
            $table->integer('max_length')->nullable(); 
            $table->integer('max_width')->nullable();  
            $table->integer('max_height')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baggage_packages');
    }
};
