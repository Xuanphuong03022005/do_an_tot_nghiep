<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoundTrip extends Model
{
    public function bookings()
    {
        return $this->hasMany(Bookings::class);
    }
}
