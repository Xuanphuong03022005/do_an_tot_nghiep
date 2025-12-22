<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Seats extends Model
{
    use SoftDeletes;
     protected $fillable = [
        'airline_id',
        'seat_class_id',
        'row_number',
        'seat_position',
        'seat_number',
        'status'
    ];
}

