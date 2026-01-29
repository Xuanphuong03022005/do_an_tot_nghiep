<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
 public function authorize(): bool
{
    return true; // Đổi từ false thành true
}

public function rules(): array
{
    return [
        'code' => 'required|string|unique:discounts,code',
        'type' => 'required|in:percentage,fixed_amount',
        'value' => 'required|numeric|min:0',
        'min_order_amount' => 'required|numeric|min:0',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'usage_limit' => 'required|integer|min:1',
        'status' => 'required|in:active,inactive',
        'description' => 'nullable|string'
    ];
}
}
