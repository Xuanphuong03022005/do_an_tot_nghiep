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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => 'required|string|max:50|unique:discounts,code',
            'type' => 'required|in:percentage,fixed_amount',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date|date_format:Y-m-d',
            'end_date' => 'required|date|date_format:Y-m-d|after_or_equal:start_date',
            'usage_limit' => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive'
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
            'code.required' => 'Mã giảm giá là bắt buộc',
            'code.unique' => 'Mã giảm giá này đã tồn tại',
            'code.max' => 'Mã giảm giá không được vượt quá 50 ký tự',
            'type.required' => 'Loại giảm giá là bắt buộc',
            'type.in' => 'Loại giảm giá phải là percentage hoặc fixed_amount',
            'value.required' => 'Giá trị giảm giá là bắt buộc',
            'value.numeric' => 'Giá trị giảm giá phải là số',
            'value.min' => 'Giá trị giảm giá phải lớn hơn hoặc bằng 0',
            'min_order_amount.required' => 'Số tiền tối thiểu là bắt buộc',
            'min_order_amount.numeric' => 'Số tiền tối thiểu phải là số',
            'min_order_amount.min' => 'Số tiền tối thiểu phải lớn hơn hoặc bằng 0',
            'start_date.required' => 'Ngày bắt đầu là bắt buộc',
            'start_date.date_format' => 'Ngày bắt đầu phải có định dạng Y-m-d',
            'end_date.required' => 'Ngày kết thúc là bắt buộc',
            'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            'end_date.date_format' => 'Ngày kết thúc phải có định dạng Y-m-d',
            'usage_limit.required' => 'Giới hạn sử dụng là bắt buộc',
            'usage_limit.integer' => 'Giới hạn sử dụng phải là số nguyên',
            'usage_limit.min' => 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1',
            'status.required' => 'Trạng thái là bắt buộc',
            'status.in' => 'Trạng thái phải là active hoặc inactive'
        ];
    }
}
