<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateBaggageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'booking_ticket_id' => 'sometimes|required|exists:booking_tickets,id',
            'type' => 'sometimes|required|in:carry_on,checked',
            'weight' => 'sometimes|required|numeric|min:0',
            'size' => 'sometimes|nullable|string|max:255',
            'price' => 'sometimes|required|integer|min:0',
            'note' => 'sometimes|nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'booking_ticket_id.required' => 'Vui lòng cung cấp booking_ticket_id.',
            'booking_ticket_id.exists' => 'Booking ticket không tồn tại.',

            'type.required' => 'Loại hành lý là trường bắt buộc.',
            'type.in' => 'Loại hành lý không hợp lệ (carry_on hoặc checked).',

            'weight.required' => 'Trọng lượng là trường bắt buộc.',
            'weight.numeric' => 'Trọng lượng phải là số.',
            'weight.min' => 'Trọng lượng phải lớn hơn hoặc bằng 0.',

            'size.string' => 'Kích thước phải là chuỗi.',
            'size.max' => 'Kích thước không được vượt quá 255 ký tự.',

            'price.required' => 'Giá là trường bắt buộc.',
            'price.integer' => 'Giá phải là số nguyên.',
            'price.min' => 'Giá phải lớn hơn hoặc bằng 0.',

            'note.string' => 'Ghi chú phải là chuỗi.',
            'note.max' => 'Ghi chú không được vượt quá 1000 ký tự.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'message' => 'Dữ liệu hành lý không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422);

        throw new HttpResponseException($response);
    }
}
