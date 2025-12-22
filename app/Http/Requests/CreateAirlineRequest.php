<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAirlineRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:airlines,code',
            'image' => 'nullable|image|mimes:png,webp,jfif,jpg,jpeg',
            'type' => 'required|string',
            'registration_code' => 'required|string|max:50|unique:airlines,registration_code',
            'seat_rows' => 'required|numeric|min:1|max:1000',
            'seat_per_row' => 'required|numeric|min:1|max:50',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên bắt buộc phải có.',
            'code.required' => 'Mã viết tắt của hãng/máy bay bắt buộc phải có.',
            'code.unique' => 'Mã viết tắt này đã tồn tại trong hệ thống.',
            'image.image' => 'Tệp tải lên phải là ảnh.',
            'image.mimes' => 'Ảnh phải có định dạng: png, webp, jfif, jpg, hoặc jpeg.',
            'type.required' => 'Loại máy bay bắt buộc phải có.',
            'registration_code.required' => 'Mã đăng ký bắt buộc phải có.',
            'registration_code.unique' => 'Mã đăng ký này đã tồn tại trong hệ thống.',
            'seat_rows.required' => 'Số hàng dọc bắt buộc phải có.',
            'seat_rows.numeric' => 'Số hàng dọc phải là số.',
            'seat_rows.min' => 'Số hàng dọc phải lớn hơn hoặc bằng 1.',
            'seat_rows.max' => 'Số hàng dọc không vượt quá 1000.',
            'seat_per_row.required' => 'Số hàng ngang bắt buộc phải có.',
            'seat_per_row.numeric' => 'Số hàng ngang phải là số.',
            'seat_per_row.min' => 'Số hàng ngang phải lớn hơn hoặc bằng 1.',
            'seat_per_row.max' => 'Số hàng ngang không vượt quá 50.',
        ];
    }
}
