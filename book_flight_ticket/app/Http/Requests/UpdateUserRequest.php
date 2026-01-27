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
        // Lấy ID người dùng từ route để loại trừ khi kiểm tra unique email
        $userId = $this->route('id');

        return [
            'name' => 'sometimes|required|string|max:255',
            // Quan trọng: Phải thêm ",email," . $userId để không bị lỗi "Email đã tồn tại" khi giữ nguyên email cũ
            'email' => 'sometimes|required|email|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'role' => 'sometimes|integer' // Sửa thành integer vì DB của bạn lưu số (0 hoặc 1)
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
