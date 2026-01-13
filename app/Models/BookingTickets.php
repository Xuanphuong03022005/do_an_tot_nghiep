<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingTickets extends Model
{
    protected $fillable = [
        'booking_id',
        'ticket_id',
        'passenger_id',
        'flight_id',
        'seat_code',
        'type',
       
    ];
}
