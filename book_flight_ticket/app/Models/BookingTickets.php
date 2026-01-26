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
        'class_id',
        'type',
       
    ];
    public function booking()
    {
        return $this->belongsTo(Bookings::class, 'booking_id', 'id');
    }
    public function ticket()
    {
        return $this->belongsTo(Tickets::class, 'ticket_id', 'id');
    }
    public function passenger()
    {
        return $this->belongsTo(Passengers::class, 'passenger_id', 'id');
    }
    public function flight()
    {
        return $this->belongsTo(Flights::class, 'flight_id', 'id');
    }   
}