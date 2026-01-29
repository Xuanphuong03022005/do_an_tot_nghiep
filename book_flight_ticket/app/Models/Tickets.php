<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tickets extends Model
{
    use SoftDeletes;
protected $fillable = [
    'airline_id',    // Bắt buộc thêm trường này
    'flight_id', 
    'class_id', 
    'total_seats', 
    'available_seats', 
    'price',
    'row_start', 
    'row_end'
];


public function flight()
{
    return $this->belongsTo(Flights::class, 'flight_id');
}

public function seat_class() {
    return $this->belongsTo(SeatClasses::class, 'class_id'); // Thay SeatClass bằng tên Model hạng ghế của bạn
}
}
