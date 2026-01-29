<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateFlightRequest;
use App\Models\Airports;
use App\Models\Flights;
use App\Models\SeatFlights;
use App\Models\Seats;
use App\Models\Tickets;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminFlightsController extends Controller
{
 public function index(Request $request) {
    try {
        // Sử dụng query builder cơ bản để tránh bị ảnh hưởng bởi các Scope lạ
        $query = Flights::with(['airline', 'departureAirport', 'arrivalAirport']);

        if ($request->has('airline_id') && $request->airline_id != "") {
            $query->where('airline_id', $request->airline_id);
        }

        $flights = $query->orderBy('id', 'desc')->get(); // Sắp xếp cái mới nhất lên đầu

        return response()->json([
            'data' => $flights,
            'message' => 'Lấy danh sách thành công'
        ], 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
    }
}

    public function show($id)
    {
        try {
            $flight = Flights::with([
                'airline', 
                'departureAirport', 
                'arrivalAirport', 
                'tickets.seat_class'
            ])->find($id);

            if (!$flight) return response()->json(['message' => 'Không tìm thấy chuyến bay'], 404);
            return response()->json($flight, 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi hệ thống.'], 500);
        }
    }

  public function store(CreateFlightRequest $request)
{
    $data = $request->all();
    $outbound = $data['outbound_flight'] ?? null;

    // 1. Kiểm tra sân bay đi và đến không được trùng nhau
    if ($data['departure_airport_id'] == $data['arrival_airport_id']) {
        return response()->json(['message' => 'Sân bay đến không thể trùng với sân bay đi.'], 422);
    }

    DB::beginTransaction();
    try {
        // 2. Chỉ tạo duy nhất bản ghi chuyến bay
        $flight = Flights::create([
            'airline_id'           => $data['airline_id'],
            'departure_airport_id' => $data['departure_airport_id'],
            'arrival_airport_id'   => $data['arrival_airport_id'],
            'departure_time'       => $outbound['departure_time'] ?? null,
            'arrival_time'         => $outbound['arrival_time'] ?? null,
            'flight_number'        => $data['flight_number'],
            'free_baggage_kg'      => $data['free_baggage_kg'] ?? 20,
        ]);

        DB::commit();
        return response()->json([
            'message' => 'Tạo chuyến bay thành công!',
            'data'    => $flight
        ], 200);

    } catch (Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Lỗi khi lưu chuyến bay: ' . $e->getMessage()
        ], 500);
    }
}

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $flight = Flights::find($id);
            if (!$flight) return response()->json(['message' => 'Không tồn tại'], 404);
            
            if (Tickets::where('flight_id', $id)->whereRaw('available_seats < total_seats')->exists()) {
                return response()->json(['message' => 'Vé đã có người đặt, không thể xóa.'], 400);
            }

            Tickets::where('flight_id', $id)->delete();
            SeatFlights::where('flight_id', $id)->delete();
            $flight->delete();

            DB::commit();
            return response()->json(['message' => 'Xóa thành công.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Thất bại'], 500);
        }
    }

    public function getFlightsByDate(Request $request)
    {
        try {
            $date = $request->query('date');
            if (!$date) return response()->json(['message' => 'Thiếu ngày.'], 400);

            $flights = Flights::with(['airline:id,name', 'departureAirport:id,name', 'arrivalAirport:id,name'])
                ->whereBetween('departure_time', [Carbon::parse($date)->startOfDay(), Carbon::parse($date)->endOfDay()])
                ->orderBy('departure_time', 'asc')->get();

            return response()->json(['data' => $flights, 'message' => 'Thành công.'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Thất bại.'], 500);
        }
    }

    private function PriceSeatBySeatclasses($seatClassesId, $array) {
        foreach ($array as $value) {
            if ($seatClassesId == $value['id']) return $value['price'];
        }
        return 0;
    }
}