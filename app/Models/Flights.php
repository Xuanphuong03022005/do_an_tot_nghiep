<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flights extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'airline_id',
        'departure_airport_id',
        'arrival_airport_id',
        'departure_time',
        'arrival_time',
        'flight_number',
        'type',
        'parent_id',
    ];
    public function airline()
    {
        return $this->belongsTo(Airlines::class);
    }
    public function departureAirport()
    {
        return $this->belongsTo(Airports::class, 'departure_airport_id');   
    }
    public function arrivalAirport()
    {
        return $this->belongsTo(Airports::class, 'arrival_airport_id');   
    }
}
