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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $discountId = $this->route('id');

        return [
            'code' => 'nullable|string|max:50|unique:discounts,code,' . $discountId,
            'type' => 'nullable|in:percentage,fixed_amount',
            'value' => 'nullable|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date|date_format:Y-m-d',
            'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:1',
            'description' => 'nullable|string|max:500',
            'status' => 'nullable|in:active,inactive,expired'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.unique' => 'Mã giảm giá này đã tồn tại',
            'code.max' => 'Mã giảm giá không được vượt quá 50 ký tự',
            'type.in' => 'Loại giảm giá phải là percentage hoặc fixed_amount',
            'value.numeric' => 'Giá trị giảm giá phải là số',
            'value.min' => 'Giá trị giảm giá phải lớn hơn hoặc bằng 0',
            'min_order_amount.numeric' => 'Số tiền tối thiểu phải là số',
            'min_order_amount.min' => 'Số tiền tối thiểu phải lớn hơn hoặc bằng 0',
            'start_date.date_format' => 'Ngày bắt đầu phải có định dạng Y-m-d',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            'end_date.date_format' => 'Ngày kết thúc phải có định dạng Y-m-d',
            'usage_limit.integer' => 'Giới hạn sử dụng phải là số nguyên',
            'usage_limit.min' => 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1',
            'status.in' => 'Trạng thái phải là active, inactive hoặc expired'
        ];
    }
}
