<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Airports extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'code',
        'country',
        'city',
        'name'
    ];
    public function depatureflight(){
        return $this->hasMany(Flights::class, 'departure_airport_id');
    }
    public function arrivalflight(){
        return $this->hasMany(Flights::class, 'arrival_airport_id');
    }
}
