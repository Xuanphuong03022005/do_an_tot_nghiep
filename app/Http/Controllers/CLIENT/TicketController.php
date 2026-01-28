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

    /**
     * Search tickets by departure, arrival, date and class
     * Support both one-way and round-trip flights
     * 
     * Request parameters:
     * - departure_airport_id: integer (airport ID)
     * - arrival_airport_id: integer (airport ID)
     * - departure_date: string (Y-m-d format)
     * - return_date: string (Y-m-d format, optional - for round-trip)
     * - num_adults: integer
     * - num_children: integer (optional)
     * - num_infants: integer (optional)
     * - class_id: integer (optional)
     */
    public function search(Request $request)
    {
        try {
            $validated = $request->validate([
                'departure_airport_id' => 'required|integer',
                'arrival_airport_id' => 'required|integer',
                'departure_date' => 'required|date_format:Y-m-d',
                'return_date' => 'nullable|date_format:Y-m-d|after:departure_date',
                'num_adults' => 'required|integer|min:1',
                'num_children' => 'nullable|integer|min:0',
                'num_infants' => 'nullable|integer|min:0',
                'class_id' => 'nullable|integer'
            ]);

            $totalPassengers = $validated['num_adults'] + 
                             ($validated['num_children'] ?? 0) + 
                             ($validated['num_infants'] ?? 0);

            // Search outbound flights
            $outboundQuery = Tickets::query()
                ->select(
                    'tickets.id',
                    'tickets.price',
                    'flights.departure_time',
                    'flights.arrival_time',
                    'a1.code as departure_airport_code',
                    'a1.name as departure_airport',
                    'a2.code as arrival_airport_code',
                    'a2.name as arrival_airport',
                    'tickets.total_seats',
                    'tickets.available_seats',
                    'a.name as airline_name',
                    'tickets.flight_id',
                    'tickets.class_id',
                    'flights.flight_number',
                    DB::raw('seat_classes.name as class_name'),
                    DB::raw('"outbound" as trip_type')
                )
                ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
                ->leftJoin('airlines as a', 'flights.airline_id', '=', 'a.id')
                ->leftJoin('airports as a1', 'flights.departure_airport_id', '=', 'a1.id')
                ->leftJoin('airports as a2', 'flights.arrival_airport_id', '=', 'a2.id')
                ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
                ->whereDate('flights.departure_time', $validated['departure_date'])
                ->where('flights.departure_airport_id', $validated['departure_airport_id'])
                ->where('flights.arrival_airport_id', $validated['arrival_airport_id'])
                ->where('tickets.available_seats', '>=', $totalPassengers);

            if ($request->filled('class_id')) {
                $outboundQuery->where('tickets.class_id', $validated['class_id']);
            }

            $outboundTickets = $outboundQuery->orderBy('tickets.price', 'asc')->get();

            $response = [
                'outbound_flights' => $outboundTickets
            ];

            // Search return flights if round-trip
            if (!empty($validated['return_date'])) {
                $returnQuery = Tickets::query()
                    ->select(
                        'tickets.id',
                        'tickets.price',
                        'flights.departure_time',
                        'flights.arrival_time',
                        'a1.code as departure_airport_code',
                        'a1.name as departure_airport',
                        'a2.code as arrival_airport_code',
                        'a2.name as arrival_airport',
                        'tickets.total_seats',
                        'tickets.available_seats',
                        'a.name as airline_name',
                        'tickets.flight_id',
                        'tickets.class_id',
                        'flights.flight_number',
                        DB::raw('seat_classes.name as class_name'),
                        DB::raw('"return" as trip_type')
                    )
                    ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
                    ->leftJoin('airlines as a', 'flights.airline_id', '=', 'a.id')
                    ->leftJoin('airports as a1', 'flights.departure_airport_id', '=', 'a1.id')
                    ->leftJoin('airports as a2', 'flights.arrival_airport_id', '=', 'a2.id')
                    ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
                    ->whereDate('flights.departure_time', $validated['return_date'])
                    ->where('flights.departure_airport_id', $validated['arrival_airport_id'])
                    ->where('flights.arrival_airport_id', $validated['departure_airport_id'])
                    ->where('tickets.available_seats', '>=', $totalPassengers);

                if ($request->filled('class_id')) {
                    $returnQuery->where('tickets.class_id', $validated['class_id']);
                }

                $returnTickets = $returnQuery->orderBy('tickets.price', 'asc')->get();
                $response['return_flights'] = $returnTickets;
            }

            return response()->json($response, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tìm kiếm vé',
            ], 500);
        }
    }
}