<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class CreateFlightRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'airline_id' => 'required|exists:airlines,id',

            'departure_airport_id' => 'required|exists:airports,id',
            'arrival_airport_id'  => 'required|exists:airports,id|different:departure_airport_id',

            'departure_time' => 'required|date|after:now',

            'arrival_time' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $departure = Carbon::parse($this->departure_time);
                    $arrival   = Carbon::parse($value);

                    if ($arrival->lte($departure)) {
                        $fail('Thời gian đến phải lớn hơn thời gian khởi hành.');
                        return;
                    }

                    if ($arrival->lt($departure->copy()->addMinutes(30))) {
                        $fail('Thời gian bay tối thiểu là 30 phút.');
                    }

                    if ($arrival->gt($departure->copy()->addHours(24))) {
                        $fail('Thời gian bay không được vượt quá 24 giờ.');
                    }

                    if ($departure->gt(now()->addYear())) {
                        $fail('Chỉ được tạo chuyến bay trong vòng 1 năm tới.');
                    }
                }
            ],

            'seat_classes' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) {
                    $ids = collect($value)->pluck('id');
                    if ($ids->count() !== $ids->unique()->count()) {
                        $fail('Các hạng ghế không được trùng nhau.');
                    }
                }
            ],

            'seat_classes.*.id' => 'required|exists:seat_classes,id',
            'seat_classes.*.price' => 'required|numeric|min:1',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'airline_id.required' => 'Vui lòng chọn hãng hàng không.',
            'airline_id.exists' => 'Hãng hàng không không tồn tại.',

            'departure_airport_id.required' => 'Vui lòng chọn sân bay đi.',
            'departure_airport_id.exists' => 'Sân bay đi không tồn tại.',
            'arrival_airport_id.required' => 'Vui lòng chọn sân bay đến.',
            'arrival_airport_id.exists' => 'Sân bay đến không tồn tại.',
            'arrival_airport_id.different' => 'Sân bay đi và sân bay đến không được trùng nhau.',

            'departure_time.required' => 'Vui lòng truyền thời gian khởi hành.',
            'departure_time.date' => 'Thời gian khởi hành không hợp lệ.',
            'departure_time.after' => 'Thời gian khởi hành phải lớn hơn thời gian hiện tại.',

            'arrival_time.required' => 'Vui lòng truyền thời gian đến.',
            'arrival_time.date' => 'Thời gian đến không hợp lệ.',

            'seat_classes.required' => 'Bắt buộc phải có ít nhất một hạng ghế.',
            'seat_classes.array' => 'Danh sách hạng ghế phải là mảng.',
            'seat_classes.min' => 'Phải có ít nhất một hạng ghế.',

            'seat_classes.*.id.required' => 'Bắt buộc phải chọn hạng ghế.',
            'seat_classes.*.id.exists' => 'Hạng ghế không tồn tại.',

            'seat_classes.*.price.required' => 'Bắt buộc phải nhập giá cho hạng ghế.',
            'seat_classes.*.price.numeric' => 'Giá phải là số.',
            'seat_classes.*.price.min' => 'Giá phải lớn hơn 0.',
        ];
    }
}
