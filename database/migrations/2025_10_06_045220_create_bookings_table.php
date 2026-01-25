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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('pnr_code');
            $table->enum('status', [
                'draft',
                'pending_payment',
                'paid',
                'ticketed',
                'completed',
                'cancelled',
                'expired',
                'failed'
            ]);
            $table->integer('total_amount');
            $table->unsignedBigInteger('discount_id')->nullable();
            $table->integer('discount_value')->nullable();
            $table->integer('total_final');
            $table->date('expired_at');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('discount_id')->references('id')->on('discounts');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
