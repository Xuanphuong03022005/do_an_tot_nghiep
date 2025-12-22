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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('flight_id');
            $table->unsignedBigInteger('class_id');
            $table->integer('price');
            $table->integer('total_seats');
            $table->integer('available_seats');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('flight_id')->references('id')->on('flights')->onDelete('cascade');
            $table->foreign('class_id')->references('id')->on('seat_classes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
