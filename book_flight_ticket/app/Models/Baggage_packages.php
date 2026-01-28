<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Baggage_packages extends Model
{
    // Thêm dòng này để cho phép lưu dữ liệu vào các cột tương ứng
    protected $fillable = [
        'weight', 
        'price', 
        'max_length', 
        'max_width', 
        'max_height'
    ];
}