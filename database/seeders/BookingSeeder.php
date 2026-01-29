<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bookings;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run()
    {
        // Thành công
        Bookings::create([
            'pnr_code' => 'VN' . strtoupper(Str::random(5)),
            'user_id' => 5,
            'total_amount' => 2500000,
            'discount_value' => 200000,
            'total_final' => 2300000,
            'status' => 'success',
            'created_at' => Carbon::now()->subDays(1),
        ]);

        // Đã hủy
        Bookings::create([
            'pnr_code' => 'VJ' . strtoupper(Str::random(5)),
            'user_id' => 5,
            'total_amount' => 1200000,
            'discount_value' => 0,
            'total_final' => 1200000,
            'status' => 'cancelled',
            'created_at' => Carbon::now()->subHours(6),
        ]);

        // Đang xử lý
        Bookings::create([
            'pnr_code' => 'QH' . strtoupper(Str::random(5)),
            'user_id' => 5,
            'total_amount' => 3000000,
            'discount_value' => 100000,
            'total_final' => 2900000,
            'status' => 'pending',
            'created_at' => Carbon::now(),
        ]);
        BookingTickets::create([
    'booking_id' => $booking->id,
    'flight_id' => 69, // ID chuyến bay có thực trong bảng flights
    'class_id' => 5,  // ID hạng ghế có thực trong bảng seat_classes
    'ticket_id' => 10,
    'passenger_id' => 1,
    'type' => 'outbound',
]);
    }
}
