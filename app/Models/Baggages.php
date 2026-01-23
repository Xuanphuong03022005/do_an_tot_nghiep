<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baggages extends Model
{
    protected $fillable = [
        'booking_ticket_id',
        'type',
        'weight',
        'price',
        'note',
    ];

    public function bookingTicket()
    {
        return $this->belongsTo(\App\Models\BookingTickets::class, 'booking_ticket_id');
    }
}
