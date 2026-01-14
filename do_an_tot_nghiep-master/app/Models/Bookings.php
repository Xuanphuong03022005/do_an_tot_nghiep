<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookings extends Model
{
    protected $fillable = [
        'user_id',
        'pnr_code',
        'discount_value',
        'discount_id',
        'total_amount',
        'total_final',
        'round_trip_id',
        'status',
    ];
    public function roundTrip()
    {
        return $this->belongsTo(RoundTrip::class, 'round_trip_id');
    }

}
