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
        Schema::create('baggages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_ticket_id');
            $table->enum('type', ['carry_on', 'checked'])->default('carry_on');
            $table->decimal('weight', 10, 2);
             $table->string('size')->nullable();
            $table->integer('price')->default(0);
             $table->string('note')->nullable();
            $table->timestamps();
            $table->foreign('booking_ticket_id')
            ->references('id')->on('booking_tickets')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baggages');
    }
};
