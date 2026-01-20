<?php

namespace App\Http\Controllers\CLIENT;

use App\Http\Controllers\Controller;
use App\Models\RoundTrip;
use Illuminate\Http\Request;
use App\Models\Tickets;
use Exception;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    /**
     * List tickets with optional filters: flight_id, class_id
     */
    public function index(Request $request)
    {
        try {
            $query = Tickets::query()
            ->select(
                'tickets.id',
                'flights.departure_time',
                'flights.arrival_time',
                'a1.name as departure_airport',
                'a2.name as arrival_airport',
                'tickets.total_seats',
                'tickets.available_seats',
                'a.name as airline_name',
                'tickets.flight_id',
                'tickets.class_id',
                'flights.flight_number',
                DB::raw('seat_classes.name as class_name')
            )
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('airlines as a', 'flights.airline_id', '=', 'a.id')
            ->leftJoin('airports as a1', 'flights.departure_airport_id', '=', 'a1.id')
            ->leftJoin('airports as a2', 'flights.arrival_airport_id', '=', 'a2.id')
            ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
            ->where('tickets.available_seats', '>', 0);

        if ($request->filled('class_id')) {
            $query->where('tickets.class_id', $request->class_id);
        }

        $perPage = (int) $request->get('per_page', 15);
        $data = $query->orderBy('tickets.price', 'asc')->paginate($perPage);

        return response()->json(['message' => 'Danh sách vé', 'data' => $data], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Không có vé.'
            ], 500);
        }
    }
    
    public function show($id)
    {
        $ticket = Tickets::select(
            'tickets.id',
            'tickets.price',
            'flights.departure_time',
            'flights.arrival_time',
            'a1.name as departure_airport',
            'a2.name as arrival_airport',
            'tickets.total_seats',
            'tickets.available_seats',
            'a.name as airline_name',
            'tickets.flight_id',
            'tickets.class_id',
            'flights.flight_number',
            DB::raw('seat_classes.name as class_name')
        )
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('airlines as a', 'flights.airline_id', '=', 'a.id')
            ->leftJoin('airports as a1', 'flights.departure_airport_id', '=', 'a1.id')
            ->leftJoin('airports as a2', 'flights.arrival_airport_id', '=', 'a2.id')
            ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
            ->where('tickets.id', $id)
            ->first();

        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }

        return response()->json(['message' => 'Chi tiết vé', 'data' => $ticket], 200);
    }
}
