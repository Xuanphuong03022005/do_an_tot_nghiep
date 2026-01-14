<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreBaggageRuleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'class_id' => 'required|exists:seat_classes,id',
            'free_weight' => 'required|numeric|min:0',
            'max_weight' => 'required|numeric|min:0',
            'max_length' => 'nullable|integer|min:0',
            'max_width' => 'nullable|integer|min:0',
            'max_height' => 'nullable|integer|min:0',
        ];
    }

    public function messages()
    {
        return [
            'class_id.required' => 'Vui lòng chọn hạng ghế.',
            'class_id.exists' => 'Hạng ghế không hợp lệ.',

            'free_weight.required' => 'Vui lòng nhập trọng lượng miễn phí.',
            'free_weight.numeric' => 'Trọng lượng miễn phí phải là số.',
            'free_weight.min' => 'Trọng lượng miễn phí phải lớn hơn hoặc bằng 0.',

            'max_weight.required' => 'Vui lòng nhập trọng lượng tối đa.',
            'max_weight.numeric' => 'Trọng lượng tối đa phải là số.',
            'max_weight.min' => 'Trọng lượng tối đa phải lớn hơn hoặc bằng 0.',

            'max_length.integer' => 'Chiều dài tối đa phải là số nguyên.',
            'max_length.min' => 'Chiều dài tối đa phải lớn hơn hoặc bằng 0.',

            'max_width.integer' => 'Chiều rộng tối đa phải là số nguyên.',
            'max_width.min' => 'Chiều rộng tối đa phải lớn hơn hoặc bằng 0.',

            'max_height.integer' => 'Chiều cao tối đa phải là số nguyên.',
            'max_height.min' => 'Chiều cao tối đa phải lớn hơn hoặc bằng 0.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $response = response()->json([
            'message' => 'Dữ liệu không hợp lệ.',
            'errors' => $validator->errors(),
        ], 422);

        throw new HttpResponseException($response);
    }
}
