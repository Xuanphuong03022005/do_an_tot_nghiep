<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'booking_id',
        'method',
        'image',
        'amount',
        'status'
    ];
    public function booking()
    {
        return $this->belongsTo(Bookings::class, 'booking_id', 'id');
    }
}