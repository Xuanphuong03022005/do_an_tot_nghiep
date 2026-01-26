<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'user_id',
        'pnr_code',
        'discount_value',
        'discount_id',
        'total_amount',
        'total_final',
        'expired_at',
        'status',
    ];
    public function payments()
    {
        return $this->hasMany(Payments::class, 'booking_id', 'id');
    }
}