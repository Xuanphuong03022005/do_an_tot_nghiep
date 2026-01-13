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
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->enum('type', ['percentage', 'fixed_amount']);
            $table->string('value');
            $table->integer('min_order_amount');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('usage_limit');
            $table->integer('used_count')->default(0);
            $table->enum('status', ['active', 'expired', 'inactive']);
            $table->string('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
