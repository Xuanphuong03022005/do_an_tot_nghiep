<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\BookingTickets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardContrroller extends Controller
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
                DB::raw('flights.aircraft_code'),
                DB::raw('seat_flights.total_seats'),
                DB::raw('COUNT(booking_tickets.id) as sold_seats'),
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->leftJoin('tickets', 'booking_tickets.ticket_id', '=', 'tickets.id')
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('seat_flights', 'flights.id', '=', 'seat_flights.flight_id')
            ->whereMonth('booking_tickets.created_at', now()->month)
            ->whereYear('booking_tickets.created_at', now()->year)
            ->groupBy('flights.aircraft_code', 'seat_flights.total_seats')
            ->orderBy('revenue', 'desc')
            ->get();

            return response()->json([
                'currency' => 'VND',
                'revenueByAircraft' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tính toán doanh thu theo máy bay',
                'error' => $e->getMessage()
            ], 500);
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
            
            $query = BookingTickets::select(
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->whereYear('booking_tickets.created_at', $year);

            if ($type === 'daily') {
                $query->select(
                    DB::raw('DATE(booking_tickets.created_at) as time'),
                    DB::raw('SUM(booking_tickets.total_price) as revenue')
                )
                ->groupBy('time')
                ->orderBy('time', 'asc');
            } else {
                $query->select(
                    DB::raw('DATE_FORMAT(booking_tickets.created_at, "%Y-%m") as time'),
                    DB::raw('SUM(booking_tickets.total_price) as revenue')
                )
                ->groupBy('time')
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
                'message' => 'Lỗi khi tính toán doanh thu theo ngày',
                'error' => $e->getMessage()
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
    public function index(Request $request)
    {
        try {
            // Revenue by class
            $byClass = BookingTickets::select(
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

            // Revenue by aircraft
            $byAircraft = BookingTickets::select(
                DB::raw('flights.aircraft_code'),
                DB::raw('seat_flights.total_seats'),
                DB::raw('COUNT(booking_tickets.id) as sold_seats'),
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->leftJoin('tickets', 'booking_tickets.ticket_id', '=', 'tickets.id')
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('seat_flights', 'flights.id', '=', 'seat_flights.flight_id')
            ->whereMonth('booking_tickets.created_at', now()->month)
            ->whereYear('booking_tickets.created_at', now()->year)
            ->groupBy('flights.aircraft_code', 'seat_flights.total_seats')
            ->orderBy('revenue', 'desc')
            ->get();

            // Revenue by date (monthly)
            $byDate = BookingTickets::select(
                DB::raw('DATE_FORMAT(booking_tickets.created_at, "%Y-%m") as time'),
                DB::raw('SUM(booking_tickets.total_price) as revenue')
            )
            ->whereYear('booking_tickets.created_at', now()->year)
            ->groupBy('time')
            ->orderBy('time', 'asc')
            ->get();

            // Revenue by route
            $byRoute = BookingTickets::select(
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
                'revenueByTicketClass' => $byClass,
                'revenueByAircraft' => $byAircraft,
                'revenueByDate' => [
                    'type' => 'monthly',
                    'data' => $byDate
                ],
                'revenueByRoute' => $byRoute
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tải dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
