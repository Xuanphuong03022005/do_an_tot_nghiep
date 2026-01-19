<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\CreateFlightRequest;
use App\Models\Airports;
use App\Models\Flights;
use App\Models\SeatFlights;
use App\Models\Seats;
use App\Models\Tickets;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class AdminFlightsController extends Controller
{
// app/Http/Controllers/ADMIN/AdminFlightsController.php

public function index()
{
    // FIX: Bỏ gọi departureAirport và arrivalAirport vì bạn đã dùng mã Code nhập tay
    $flights = Flights::with([
        'airline:id,name'
    ])->orderBy('id', 'desc')->get();

    return response()->json($flights, 200);
}

public function show($id)
{
    try {
        // Lấy chi tiết kèm máy bay và danh sách vé (kèm tên hạng ghế)
        // Đảm bảo quan hệ 'tickets.seatClass' đã được định nghĩa trong Model
        $flight = Flights::with([
            'airline', 
            'tickets.seatClass'
        ])->find($id);

        if (!$flight) {
            return response()->json(['message' => 'Không tìm thấy chuyến bay'], 404);
        }

        return response()->json($flight, 200);
    } catch (\Exception $e) {
        // Trả về thông báo lỗi chi tiết để kiểm tra trong tab Network
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

    public function store(CreateFlightRequest $request)
{
    $data = $request->validated(); // Lấy dữ liệu sạch từ Request
    DB::beginTransaction();
    try {
        // 1. Tạo chuyến bay (Bảng flights của bạn giờ dùng dep_code và arr_code)
        $flight = Flights::create([
            'airline_id'     => $data['airline_id'],
            'dep_code'       => $data['dep_code'],
            'arr_code'       => $data['arr_code'],
            'departure_time' => $data['departure_time'],
            'arrival_time'   => $data['arrival_time'],
            'flight_number'  => $data['flight_number'],
        ]);

        // 2. Lấy danh sách ghế của máy bay để tạo SeatFlights
        $seats = Seats::where('airline_id', $data['airline_id'])
            ->where('status', 'usable')
            ->get();

        $seatByFlights = [];
        foreach ($seats as $value) {
            $seatByFlights[] = [
                'flight_id'   => $flight->id,
                'seat_number' => $value->seat_number,
                'seat_id'     => $value->id,
                'price'       => $this->PriceSeatBySeatclasses($value->seat_class_id, $data['seat_classes']),
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }
        SeatFlights::insert($seatByFlights);

        // 3. Tạo Tickets cho từng hạng ghế của chuyến bay này
        $valueSeatFlights = SeatFlights::where('flight_id', $flight->id)
            ->join('seats as s', 'seat_flights.seat_id', 's.id')
            ->select(
                'flight_id',
                's.seat_class_id as class_id',
                'price',
                DB::raw('COUNT(*) as total_seats')
            )
            ->groupBy('flight_id', 's.seat_class_id', 'price')
            ->get();

        foreach ($valueSeatFlights as $value) {
            Tickets::create([
                'flight_id'       => $value->flight_id,
                'class_id'        => $value->class_id,
                'price'           => $value->price,
                'total_seats'     => $value->total_seats,
                'available_seats' => $value->total_seats
            ]);
        }

        DB::commit();
        return response()->json(['message' => 'Thêm chuyến bay thành công'], 200);
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

        if (!$flight) {
            return response()->json(['message' => 'Không tìm thấy chuyến bay'], 404);
        }

        // 1. Xóa dữ liệu ở bảng seat_flights (bảng này chắc chắn có flight_id)
        // Dùng forceDelete để xóa vĩnh viễn, tránh xung đột SoftDelete
        SeatFlights::where('flight_id', $id)->forceDelete();

        // 2. Tạm thời bỏ qua việc xóa ở bảng tickets vì thiếu cột flight_id 
        // để tránh lỗi SQLSTATE[42S22]: Column not found
        
        // 3. Xóa chính chuyến bay
        $flight->forceDelete();

        DB::commit();
        return response()->json(['message' => 'Xóa chuyến bay thành công'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Lỗi xử lý: ' . $e->getMessage()], 500);
    }
}
    public function PriceSeatBySeatclasses($seatClassesId, $array)
    {
        foreach ($array as $value) {
            if ($seatClassesId == $value['id']) {
                return $value['price'];
            }
        }
        return 0;
    }
    // app/Http/Controllers/ADMIN/AdminFlightsController.php

public function search(Request $request) 
{
    $from = $request->query('from');
    $to = $request->query('to');
    $departDate = $request->query('depart'); 
    $returnDate = $request->query('return_date'); // Nhận thêm ngày về

    // 1. Tìm chuyến đi (Departure Flights)
  
    
    if ($from) {
        $outboundQuery->whereHas('departureAirport', function($q) use ($from) {
            $q->where('code', $from);
        });
    }
    if ($to) {
        $outboundQuery->whereHas('arrivalAirport', function($q) use ($to) {
            $q->where('code', $to);
        });
    }
    if ($departDate) {
        $outboundQuery->whereDate('departure_time', '=', $departDate);
    }
    $outboundFlights = $outboundQuery->get();

    // 2. Tìm chuyến về (Return Flights) - Nếu có yêu cầu khứ hồi
    $returnFlights = [];
    if ($returnDate) {
        $returnQuery = Flights::with(['airline', 'departureAirport', 'arrivalAirport']);
        
        // Đảo ngược điểm đi và điểm đến
        $returnQuery->whereHas('departureAirport', function($q) use ($to) {
            $q->where('code', $to);
        });
        $returnQuery->whereHas('arrivalAirport', function($q) use ($from) {
            $q->where('code', $from);
        });
        $returnQuery->whereDate('departure_time', '=', $returnDate);
        
        $returnFlights = $returnQuery->get();
    }

    return response()->json([
        'outbound' => $outboundFlights,
        'return' => $returnFlights
    ], 200);
}
}
