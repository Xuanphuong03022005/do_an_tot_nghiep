<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Bookings;
use Exception;
use Illuminate\Http\Request;

use function Symfony\Component\String\b;

class AdminBookingController extends Controller
{
    public function index()
    {
        try{
        $bookings = Bookings::with('bookingTickets.passenger',
                                    'bookingTickets.flight:id,departure_airport_id,arrival_airport_id,departure_time,arrival_time,flight_number',
                                     'bookingTickets.flight.arrivalAirport:id,name',
                                     'bookingTickets.flight.departureAirport:id,name',
                                     )->get();
        return response()->json($bookings);
        }catch(Exception $e){   
            return response()->json([
                'message' =>  'Lấy danh sách đặt chỗ thất bại.'
            ], 500);
        }
    }
}