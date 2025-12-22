<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tickets extends Model
{
    use SoftDeletes;
     protected $fillable = [
        'flight_id',
        'class_id',
        'price',
        'total_seats',
        'available_seats'
    ];
}
