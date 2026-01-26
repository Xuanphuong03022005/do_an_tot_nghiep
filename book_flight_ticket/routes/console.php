<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Tickets;
use App\Models\Bookings;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// Schedule::call(function () {
//     // Nếu quá thời gian expired_at mà vẫn chưa success thì chuyển sang cancelled
//     Bookings::where('status', 'pending')
//         ->where('expired_at', '<', now())
//         ->update(['status' => 'cancelled']);
// })->everyMinute();
// Schedule::call(function () {
//     Tickets::whereIn('status', ['Pending', 'Processing'])
//         ->where('expires_at', '<', now())
//         ->update([
//             'status' => 'Cancelled',
//             'cancel_reason' => 'Hệ thống tự động hủy do quá hạn thanh toán'
//         ]);
// })->everyMinute();

// // 2. Tự động ẩn (Soft Delete) vé đã hủy sau 24h để sạch trang quản trị
// Schedule::call(function () {
//     Tickets::where('status', 'Cancelled')
//         ->where('updated_at', '<', now()->subHours(24))
//         ->delete(); // Lệnh này sẽ thực hiện Soft Delete nếu Model có use SoftDeletes
// })->daily();

// // 3. (Tùy chọn) Xóa vĩnh viễn vé trong thùng rác sau 30 ngày
// Schedule::call(function () {
//     Tickets::onlyTrashed()
//         ->where('deleted_at', '<', now()->subDays(30))
//         ->forceDelete();
// })->monthly();
