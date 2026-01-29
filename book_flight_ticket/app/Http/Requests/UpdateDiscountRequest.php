<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
  public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    $id = $this->route('id'); // Lấy ID từ route
    return [
        'code' => 'sometimes|string|unique:discounts,code,' . $id,
        'type' => 'sometimes|in:percentage,fixed_amount',
        'value' => 'sometimes|numeric|min:0',
        'min_order_amount' => 'sometimes|numeric|min:0',
        'start_date' => 'sometimes|date',
        'end_date' => 'sometimes|date|after_or_equal:start_date',
        'usage_limit' => 'sometimes|integer|min:1',
        'status' => 'sometimes|in:active,inactive',
        'description' => 'nullable|string'
    ];
}
}
