<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'user_id' => 'nullable|exists:users,id',
            // Allow either one-way 'flight_id' or round-trip 'outbound_flight_id' + 'return_flight_id'
            'flight_id' => 'nullable|exists:flights,id',
            'outbound_flight_id' => 'nullable|exists:flights,id',
            'return_flight_id' => 'nullable|exists:flights,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.ticket_id' => 'required|exists:tickets,id',
            'tickets.*.type' => 'nullable|in:outbound,return',
            'tickets.*.passengers' => 'required|array|min:1',
            'tickets.*.passengers.*.name' => 'required|string',
            'tickets.*.passengers.*.gender' => 'required|in:male,female,other',
            'tickets.*.passengers.*.identity_number' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'flight_id.required' => 'Vui lòng chọn chuyến bay.',
            'tickets.required' => 'Vui lòng cung cấp thông tin vé.',
            'tickets.*.ticket_id.required' => 'Vui lòng chọn ticket.',
            'tickets.*.passengers.required' => 'Vui lòng cung cấp thông tin hành khách cho ticket.',
            'tickets.*.passengers.*.name.required' => 'Vui lòng nhập tên hành khách.',
            'tickets.*.passengers.*.gender.required' => 'Vui lòng chọn giới tính.',
            'tickets.*.passengers.*.identity_number.required' => 'Vui lòng nhập số giấy tờ tùy thân.',
            'outbound_flight_id.exists' => 'Chuyến đi (outbound) không tồn tại.',
            'return_flight_id.exists' => 'Chuyến về (return) không tồn tại.',
            'tickets.*.type.in' => 'Loại vé phải là outbound hoặc return.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $this->all();
            $hasFlight = !empty($data['flight_id']);
            $hasOutboundReturn = !empty($data['outbound_flight_id']) && !empty($data['return_flight_id']);
            if (! $hasFlight && ! $hasOutboundReturn) {
                $validator->errors()->add('flight_id', 'Vui lòng cung cấp `flight_id` cho một chiều hoặc `outbound_flight_id` và `return_flight_id` cho khứ hồi.');
                return;
            }
            if (!empty($data['outbound_flight_id']) && empty($data['return_flight_id'])) {
                $validator->errors()->add('return_flight_id', 'Vui lòng cung cấp `return_flight_id` khi đã gửi `outbound_flight_id`.');
            }
            // If round-trip, ensure each ticket has a type specified (outbound/return)
            if ($hasOutboundReturn) {
                foreach ($data['tickets'] as $i => $t) {
                    if (empty($t['type']) || !in_array($t['type'], ['outbound', 'return'])) {
                        $validator->errors()->add("tickets.$i.type", 'Vui lòng chỉ định `type` là outbound hoặc return cho mỗi vé khi đặt khứ hồi.');
                    }
                }
            }
        });
    }
}
