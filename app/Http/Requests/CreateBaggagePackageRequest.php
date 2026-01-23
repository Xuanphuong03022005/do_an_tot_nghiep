<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBaggagePackageRequest extends FormRequest
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
            'weight' => 'required|numeric|min:0.1|max:999.99',
            'price' => 'required|numeric|min:0',
            'max_length' => 'required|numeric|min:1|max:9999',
            'max_width' => 'required|numeric|min:1|max:9999',
            'max_height' => 'required|numeric|min:1|max:9999'
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'weight.required' => 'Trọng lượng là bắt buộc.',
            'weight.numeric' => 'Trọng lượng phải là số.',
            'weight.min' => 'Trọng lượng phải lớn hơn 0.',
            'price.required' => 'Giá là bắt buộc.',
            'price.numeric' => 'Giá phải là số.',
            'price.min' => 'Giá không thể âm.',
            'max_length.required' => 'Chiều dài tối đa là bắt buộc.',
            'max_length.numeric' => 'Chiều dài tối đa phải là số.',
            'max_width.required' => 'Chiều rộng tối đa là bắt buộc.',
            'max_width.numeric' => 'Chiều rộng tối đa phải là số.',
            'max_height.required' => 'Chiều cao tối đa là bắt buộc.',
            'max_height.numeric' => 'Chiều cao tối đa phải là số.'
        ];
    }
}
