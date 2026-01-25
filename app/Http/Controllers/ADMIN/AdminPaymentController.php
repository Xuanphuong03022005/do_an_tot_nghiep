<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Bookings;
use Exception;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function bookingPending()
    {
        $bookings = Bookings::where('status', 'pending')->get();
        return response()->json($bookings);
    }
    public function bookingPendingDetail($id)
    {
        $bookings = Bookings::where('id', $id)->with('payments')->first();
        return response()->json($bookings);
    }
    public function changeStatus(Request $request, $id)
    {

        try {
            $booking = Bookings::find($id);
            $booking->status = $request->input('status');
            $booking->save();
            return response()->json(['message' => 'Cập nhật trạng thái thành công']);
        } catch (Exception $e) {
            return response()->json([
                'message' =>  'Cập nhật trạng thái thất bại.'
            ], 500);
        }
    }
}
