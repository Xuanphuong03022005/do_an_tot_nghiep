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
                'tickets.*',
                'flights.flight_number',
                'flights.departure_time',
                'flights.arrival_time',
                DB::raw('seat_classes.name as class_name')
            )
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id');

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
            'tickets.*',
            'flights.flight_number',
            'flights.departure_time',
            'flights.arrival_time',
            'a.name',
            DB::raw('seat_classes.name as class_name')
        )
            ->leftJoin('flights', 'tickets.flight_id', '=', 'flights.id')
            ->leftJoin('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
            ->leftJoin('airlines as a', 'flights.airline_id', 'a.id')
            ->where('tickets.id', $id)
            ->first();

        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }

        return response()->json(['message' => 'Chi tiết vé', 'data' => $ticket], 200);
    }
}
