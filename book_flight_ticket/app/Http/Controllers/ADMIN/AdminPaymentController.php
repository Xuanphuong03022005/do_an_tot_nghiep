<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Bookings;
use Exception;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
// AdminPaymentController.php
public function index(Request $request) 
{
    $query = Bookings::with([
        'user', 
        'payments',
        'bookingTickets.seatClass',
        'bookingTickets.flight.departureAirport', // Lấy sân bay đi
        'bookingTickets.flight.arrivalAirport',   // Lấy sân bay đến
    ]);

    if ($request->searchTerm) {
        $query->where('pnr_code', 'like', "%{$request->searchTerm}%");
    }

    $bookings = $query->orderBy('created_at', 'desc')->paginate(10);

    return response()->json([
        'message' => 'Danh sách đơn đặt vé chi tiết',
        'data' => $bookings->items(),
        'total' => $bookings->total(),
        'current_page' => $bookings->currentPage(),
        'last_page' => $bookings->lastPage()
    ], 200);
}
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