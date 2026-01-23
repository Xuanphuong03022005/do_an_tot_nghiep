<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email',
            'password' => 'sometimes|nullable|string|min:6',
            'phone' => 'sometimes|nullable|string|max:50',
            'address' => 'sometimes|nullable|string|max:500',
            'role' => 'sometimes|nullable|string'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên là bắt buộc.',
            'name.string' => 'Tên không hợp lệ.',
            'name.max' => 'Tên tối đa :max ký tự.',

            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',

            'password.string' => 'Mật khẩu không hợp lệ.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',

            'phone.string' => 'Số điện thoại không hợp lệ.',
            'phone.max' => 'Số điện thoại tối đa :max ký tự.',

            'address.string' => 'Địa chỉ không hợp lệ.',
            'address.max' => 'Địa chỉ tối đa :max ký tự.',

            'role.string' => 'Vai trò không hợp lệ.'
        ];
    }
}
