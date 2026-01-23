<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Airlines extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'code',
        'image',
        'type',
        'registration_code',
        'seat_rows',
        'seat_per_row',
    ];
    public function seats(){
        return $this->hasMany(Seats::class, 'airline_id');
    }
    public function flights(){
        return $this->hasMany(Flights::class, 'airline_id');
    }
}
