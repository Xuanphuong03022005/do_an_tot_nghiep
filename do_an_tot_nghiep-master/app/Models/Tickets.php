<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tickets extends Model
{
    // use SoftDeletes;
protected $fillable = [
    'airline_id',
    'class_id',
    'price',
    'total_seats',
    'available_seats'
];
// app/Models/Tickets.php
public function seatClass()
{
    return $this->belongsTo(SeatClasses::class, 'class_id');
}
}
