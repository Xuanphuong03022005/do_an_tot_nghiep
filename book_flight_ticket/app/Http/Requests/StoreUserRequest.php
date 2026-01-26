<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|ends_with:.com|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
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
            'email.ends_with' => 'Email phải kết thúc bằng .com.',

            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu không hợp lệ.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',

            'phone.string' => 'Số điện thoại không hợp lệ.',
            'phone.max' => 'Số điện thoại tối đa :max ký tự.',

            'address.string' => 'Địa chỉ không hợp lệ.',
            'address.max' => 'Địa chỉ tối đa :max ký tự.',

        ];
    }
}
