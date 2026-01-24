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
    public function index()
    {
        try {
            $flights = Flights::with(['airline:id,name', 'departureAirport:id,name', 'arrivalAirport:id,name'])
                ->orderBy('departure_time', 'asc')
                ->get();
            return response()->json([
                'data' => $flights,
                'message' => 'Lấy danh sách chuyến bay thành công.'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lấy danh sách thất bại.'], 500);
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
    $outbound = $data['outbound_flight'];
    
    // 1. Kiểm tra trùng sân bay
    if ($data['departure_airport_id'] == $data['arrival_airport_id']) {
        return response()->json(['message' => 'Sân bay đến không thể trùng với sân bay đi.'], 422);
    }

    // 2. Lấy cấu hình máy bay mẫu (những dòng flight_id là NULL)
    $airlineConfigs = Tickets::where('airline_id', $data['airline_id'])->whereNull('flight_id')->get();
    if ($airlineConfigs->isEmpty()) {
        return response()->json(['message' => 'Máy bay chưa được cấu hình hạng ghế!'], 422);
    }

    DB::beginTransaction();
    try {
        $depAirport = Airports::find($data['departure_airport_id']);
        $arrAirport = Airports::find($data['arrival_airport_id']);

        // 3. Tạo Chuyến bay
        $flight = Flights::create([
            'airline_id' => $data['airline_id'],
            'departure_airport_id' => $data['departure_airport_id'],
            'arrival_airport_id' => $data['arrival_airport_id'],
            'free_baggage_kg' => $data['free_baggage_kg'] ?? 20,
            'departure_time' => $outbound['departure_time'],
            'arrival_time' => $outbound['arrival_time'],
            'flight_number' => $depAirport->code . '-' . $arrAirport->code . '-' . now()->timestamp,
        ]);

        // 4. Tạo SeatFlights (Ghế vật lý cho chuyến bay)
        $seats = Seats::where('airline_id', $data['airline_id'])->where('status', 'usable')->get();
        $seatByFlights = [];
        foreach ($seats as $s) {
            $price = $this->PriceSeatBySeatclasses($s->seat_class_id, $outbound['seat_classes']);
            if ($price > 0) {
                $seatByFlights[] = [
                    'flight_id' => $flight->id,
                    'seat_number' => $s->seat_number,
                    'seat_id' => $s->id,
                    'price' => $price,
                    'created_at' => now(), 'updated_at' => now()
                ];
            }
        }
        SeatFlights::insert($seatByFlights);

        // 5. TẠO VÉ (TICKETS) - CHỈ LÀM BƯỚC NÀY ĐỂ TRÁNH NHÂN ĐÔI
        // Kế thừa dải hàng (row_start, row_end) từ cấu hình máy bay
        foreach ($airlineConfigs as $config) {
            $price = $this->PriceSeatBySeatclasses($config->class_id, $outbound['seat_classes']);
            Tickets::create([
                'flight_id' => $flight->id,
                'airline_id' => $data['airline_id'],
                'class_id' => $config->class_id,
                'price' => $price,
                'total_seats' => $config->total_seats,
                'available_seats' => $config->total_seats,
                'row_start' => $config->row_start,
                'row_end' => $config->row_end,
            ]);
        }

        DB::commit();
        return response()->json(['message' => 'Thêm chuyến bay thành công.'], 200);
    } catch (Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
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