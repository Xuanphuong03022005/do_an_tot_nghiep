<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Tickets;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Tickets::query();

        if ($request->has('flight_id')) {
            $query->where('flight_id', $request->flight_id);
        }
        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        $perPage = (int) $request->get('per_page', 15);
         $query->join('seat_classes', 'tickets.class_id', '=', 'seat_classes.id')
                ->join('flights', 'tickets.flight_id', '=', 'flights.id')
                ->join('airports as dep_airport', 'flights.departure_airport_id', '=', 'dep_airport.id')
                ->join('airports as arr_airport', 'flights.arrival_airport_id', '=', 'arr_airport.id')
                ->join('airlines', 'flights.airline_id', '=', 'airlines.id')
               ->select('tickets.*', 'seat_classes.name as class_name', 'flights.flight_number', 'dep_airport.name as departure_airport', 'arr_airport.name as arrival_airport', 'airlines.name as airline_name');
        $data = $query->orderBy('id', 'desc')->paginate($perPage);
        return response()->json(['message' => 'Danh sách vé', 'data' => $data], 200);
    }

    public function show($id)
    {
        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }
        return response()->json(['message' => 'Chi tiết ticket', 'data' => $ticket], 200);
    }


    public function update(Request $request, $id)
    {
        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }

        $validated = $request->validate([
            'price' => 'nullable|numeric|min:0',
            'total_seats' => 'nullable|integer|min:1',
            'available_seats' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            if (array_key_exists('price', $validated)) $ticket->price = $validated['price'];
            if (array_key_exists('total_seats', $validated)) {
                $ticket->total_seats = $validated['total_seats'];
                // ensure available does not exceed total
                if ($ticket->available_seats > $ticket->total_seats) {
                    $ticket->available_seats = $ticket->total_seats;
                }
            }
            if (array_key_exists('available_seats', $validated)) {
                $ticket->available_seats = min($validated['available_seats'], $ticket->total_seats);
            }

            $ticket->save();
            DB::commit();
            return response()->json(['message' => 'Cập nhật ticket thành công.', 'data' => $ticket], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Cập nhật ticket thất bại.'], 500);
        }
    }

    public function destroy($id)
    {
        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }
        try {
            $ticket->delete();
            return response()->json(['message' => 'Xóa ticket thành công.'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Xóa ticket thất bại.'], 500);
        }
    }
}
