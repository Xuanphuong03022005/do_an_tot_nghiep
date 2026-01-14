<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baggage_rules extends Model
{
    protected $fillable = [
        'class_id',
        'free_weight',
        'max_weight',
        'max_length',
        'max_width',
        'max_height',
    ];

    public function seatClass()
    {
        return $this->belongsTo(SeatClasses::class, 'class_id');
    }
}
