<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passengers extends Model
{
    protected $fillable = [
        'name',
        'gender',
        'phone',
        'email',
        'identity_type',
        'identity_number'
    ];
}
