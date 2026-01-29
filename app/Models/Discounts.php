<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discounts extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'status',
        'description'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'value' => 'float',
        'min_order_amount' => 'float',
        'usage_limit' => 'integer',
        'used_count' => 'integer'
    ];

    // Kiểm tra mã giảm giá có hợp lệ không
    public function isValid()
    {
        $now = now()->toDateString();
        
        return $this->status === 'active'
            && $this->start_date <= $now
            && $this->end_date >= $now
            && $this->used_count < $this->usage_limit;
    }

    // Kiểm tra mã giảm giá có có thể sử dụng cho đơn hàng với số tiền cụ thể không
    public function canBeUsedFor($orderAmount)
    {
        return $this->isValid() && $orderAmount >= $this->min_order_amount;
    }

    // Lấy giá trị giảm giá
    public function getDiscountAmount($orderAmount)
    {
        if (!$this->canBeUsedFor($orderAmount)) {
            return 0;
        }

        if ($this->type === 'percentage') {
            return ($orderAmount * $this->value) / 100;
        }

        return min($this->value, $orderAmount);
    }

    // Tăng số lần sử dụng
    public function incrementUsedCount()
    {
        $this->increment('used_count');
    }
}
