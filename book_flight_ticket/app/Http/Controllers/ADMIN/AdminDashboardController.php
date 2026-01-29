<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\BookingTickets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Revenue statistics by ticket class
     */
    public function revenueByTicketClass()
    {
        try {
            $data = BookingTickets::select(
                DB::raw('seat_classes.name as ticket_class'),
                DB::raw('COUNT(booking_tickets.id) as sold_seats'),
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->leftJoin('tickets', 'booking_tickets.ticket_id', '=', 'tickets.id')
            ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
            ->whereMonth('booking_tickets.created_at', now()->month)
            ->whereYear('booking_tickets.created_at', now()->year)
            ->groupBy('seat_classes.name')
            ->orderBy('revenue', 'desc')
            ->get();

            return response()->json([
                'currency' => 'VND',
                'revenueByTicketClass' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tính toán doanh thu theo hạng vé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Revenue statistics by aircraft
     */
public function revenueByAircraft()
{
    try {
        $data = BookingTickets::select(
            'flights.flight_number', // Sửa từ aircraft_code thành flight_number
            DB::raw('COUNT(booking_tickets.id) as sold_seats'),
            DB::raw('SUM(booking_tickets.total_price) as revenue')
        )
        ->join('tickets', 'booking_tickets.ticket_id', '=', 'tickets.id')
        ->join('flights', 'tickets.flight_id', '=', 'flights.id')
        // Tạm thời bỏ lọc whereMonth để kiểm tra xem có dữ liệu hay không
        ->groupBy('flights.flight_number')
        ->orderBy('revenue', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'revenueByAircraft' => $data
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
    /**
     * Revenue statistics by date (monthly by default)
     * Query params: type (monthly/daily), year, month
     */
   public function revenueByDate(Request $request)
{
    try {
        $type = $request->get('type', 'monthly');
        $year = $request->get('year', now()->year);
        
        // Kiểm tra xem bảng của bạn là 'booking_tickets' hay 'bookings'
        // Và cột giá là 'total_price' hay 'total_amount'
        $query = BookingTickets::query()->whereYear('created_at', $year);

        if ($type === 'daily') {
            $query->select(
                DB::raw('DATE(created_at) as time'),
                DB::raw('SUM(total_price) as revenue') // Đảm bảo cột total_price tồn tại
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('time', 'asc');
        } else {
            $query->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as time'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
            ->orderBy('time', 'asc');
        }

        $data = $query->get();

        return response()->json([
            'currency' => 'VND',
            'revenueByDate' => [
                'type' => $type,
                'year' => $year,
                'data' => $data
            ]
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Lỗi SQL: ' . $e->getMessage(),
            'error' => $e->getCode()
        ], 500);
    }
}

    /**
     * Revenue statistics by route
     */
    public function revenueByRoute()
    {
        try {
            $data = BookingTickets::select(
                DB::raw('CONCAT(a1.code, " → ", a2.code) as route'),
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->leftJoin('tickets', 'booking_tickets.ticket_id', '=', 'tickets.id')
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('airports as a1', 'flights.departure_airport_id', '=', 'a1.id')
            ->leftJoin('airports as a2', 'flights.arrival_airport_id', '=', 'a2.id')
            ->whereMonth('booking_tickets.created_at', now()->month)
            ->whereYear('booking_tickets.created_at', now()->year)
            ->groupBy('flights.departure_airport_id', 'flights.arrival_airport_id')
            ->orderBy('revenue', 'desc')
            ->get();

            return response()->json([
                'currency' => 'VND',
                'revenueByRoute' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tính toán doanh thu theo tuyến đường',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete dashboard statistics
     */
}