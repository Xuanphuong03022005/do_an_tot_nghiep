<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeatFlights extends Model
{
    protected $fillable = [
        'flight_id', 
        'seat_id', 
        'seat_number', 
        'price', 
        ];
}
