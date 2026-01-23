<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePassengerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'gender' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'identity_type' => 'nullable|string|max:50',
            'identity_number' => 'nullable|string|max:100',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên là trường bắt buộc.',
            'name.string' => 'Tên phải là chuỗi ký tự.',
            'name.max' => 'Tên không được vượt quá 255 ký tự.',

            'gender.required' => 'Giới tính là trường bắt buộc.',
            'gender.string' => 'Giới tính phải là chuỗi ký tự.',
            'gender.max' => 'Giới tính không được vượt quá 20 ký tự.',

            'phone.required' => 'Số điện thoại là trường bắt buộc.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.max' => 'Số điện thoại không được vượt quá 20 ký tự.',

            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',

            'identity_type.string' => 'Loại giấy tờ phải là chuỗi ký tự.',
            'identity_type.max' => 'Loại giấy tờ không được vượt quá 50 ký tự.',

            'identity_number.string' => 'Số giấy tờ phải là chuỗi ký tự.',
            'identity_number.max' => 'Số giấy tờ không được vượt quá 100 ký tự.',
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
