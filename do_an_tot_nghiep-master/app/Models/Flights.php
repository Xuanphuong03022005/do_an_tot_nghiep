<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flights extends Model
{
    // use SoftDeletes;

    protected $fillable = [
        'airline_id',
        'dep_code', 
        'arr_code', 
        'departure_time',
        'arrival_time',
        'flight_number',
        'free_baggage_kg'
    ];

    // Quan hệ lấy thông tin máy bay
    public function airline()
    {
        return $this->belongsTo(Airlines::class, 'airline_id');
    }

    // Quan hệ lấy danh sách vé của chuyến bay
    public function tickets()
    {
        return $this->hasMany(Tickets::class, 'flight_id');
    }
}