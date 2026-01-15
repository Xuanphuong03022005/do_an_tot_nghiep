<?php

namespace App\Http\Requests;

use App\Models\Tickets;
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
            'outbound_flight_id' => 'nullable|exists:flights,id',
            'return_flight_id' => 'nullable|exists:flights,id',
            'tickets' => 'required|array|min:1',
            'tickets.*.ticket_id' => 'required|exists:tickets,id',
            'tickets.*.class_id' => 'required|exists:seat_classes,id',
            'tickets.*.passengers' => 'required|array|min:1',
            'tickets.*.passengers.*.name' => 'required|string',
            'tickets.*.passengers.*.gender' => 'required|in:male,female,other',
            'tickets.*.passengers.*.identity_number' => 'required|string',
            'tickets.*.passengers.*.type' => 'required|in:ADT,CHD,INF',
            'tickets.*.passengers.*.baggage' => 'sometimes|array',
            'tickets.*.passengers.*.baggage.*.weight' => 'required_with:tickets.*.passengers.*.baggage|numeric|min:0',
            'tickets.*.passengers.*.baggage.*.size' => 'sometimes|nullable|string|max:255',
            'tickets.*.passengers.*.baggage.*.note' => 'sometimes|nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'tickets.required' => 'Vui lòng cung cấp thông tin vé.',
            'tickets.*.ticket_id.required' => 'Vui lòng chọn vé.',
            'outbound_flight_id.exists' => 'Chuyến đi (outbound) không tồn tại.',
            'return_flight_id.exists' => 'Chuyến về (return) không tồn tại.',
            'tickets.*.class_id.exists' => 'Hạng ghế không tồn tại.',
            'tickets.*.class_id.required' => 'Vui lòng cung cấp thông tin hạng ghế cho vé.',
            'tickets.*.passengers.required' => 'Vui lòng cung cấp thông tin hành khách cho vé.',
            'tickets.*.passengers.*.name.required' => 'Vui lòng nhập tên hành khách.',
            'tickets.*.passengers.*.gender.required' => 'Vui lòng chọn giới tính.',
            'tickets.*.passengers.*.identity_number.required' => 'Vui lòng nhập số giấy tờ tùy thân.',
            'tickets.*.passengers.*.type.required' => 'Vui lòng chọn loại hành khách (người lớn/trẻ em/em bé).',
            'tickets.*.passengers.*.type.in' => 'Loại hành khách không hợp lệ.',
            'tickets.*.passengers.*.baggage.array' => 'Thông tin hành lý phải là một mảng.',
            'tickets.*.passengers.*.baggage.*.type.in' => 'Loại hành lý không hợp lệ.',
            'tickets.*.passengers.*.baggage.*.weight.required_with' => 'Vui lòng nhập trọng lượng hành lý.',
            'tickets.*.passengers.*.baggage.*.weight.numeric' => 'Trọng lượng hành lý phải là số.',
            'tickets.*.passengers.*.baggage.*.weight.min' => 'Trọng lượng hành lý phải lớn hơn hoặc bằng 0.',
            'tickets.*.passengers.*.baggage.*.size.max' => 'Kích thước hành lý không được vượt quá 255 ký tự.',
            'tickets.*.passengers.*.baggage.*.price.min' => 'Giá hành lý phải lớn hơn hoặc bằng 0.',
            'tickets.*.passengers.*.baggage.*.note.max' => 'Ghi chú hành lý không được vượt quá 1000 ký tự.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!is_array($this->tickets)) {
            return;
        }
            foreach ($this->tickets as $index => $ticket) {
                $exists = Tickets::where('id', $ticket['ticket_id'])
                    ->where('class_id', $ticket['class_id'])
                    ->exists();
                if (! $exists) {
                    $validator->errors()->add(
                        "tickets.$index.ticket_id", 'Vé không tồn tại hoặc không đúng hạng.'
                    );
                }
            }
        });
    }
}
