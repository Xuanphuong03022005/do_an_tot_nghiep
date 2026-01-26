<?php

namespace App\Http\Controllers\CLIENT;

use App\Helpers\CloudinaryUpload;
use App\Http\Controllers\Controller;
use App\Models\Bookings;
use App\Models\Payments;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $file = $request->file('image');
            $name = 'paynment_' . $data['booking_id'];
            $res = CloudinaryUpload::upload($file, 'payments', $name);
            if ($res) {
                $imageName = $res['url'];
            } else {
                return response()->json(['message' => 'Lưu ảnh thất bại'], 500);
            }
            $payment = Payments::create([
                'booking_id' => $data['booking_id'],
                'method' => $data['method'],
                'image' => $imageName,
                'amount' => $data['amount'],
                'status' => 'success',
            ]);
            $booking = Bookings::find($data['booking_id']);
            $booking->status = 'pending';
            $booking->save();
            DB::commit();
            return response()->json(['message' => 'Thanh toán thành công'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi tạo thanh toán.'
            ], 500);
        }
    }
}