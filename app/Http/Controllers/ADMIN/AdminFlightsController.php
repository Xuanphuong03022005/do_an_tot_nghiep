<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateFlightRequest;
use App\Models\Airports;
use App\Models\Flights;
use App\Models\RoundTrip;
use App\Models\SeatFlights;
use App\Models\Seats;
use App\Models\Tickets;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AdminFlightsController extends Controller
{
    public function index(Request $request)
    {
        try{
            $flights = Flights::with(['airline:id,name', 'departureAirport:id,name', 'arrivalAirport:id,name'])
                ->orderBy('departure_time', 'asc')
                ->get();
            return response()->json($flights);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy danh sách chuyến bay thất bại.'
            ], 500);
        }
    }

    public function store(CreateFlightRequest $request)
    {
        $data = $request->all();
        DB::beginTransaction();
        try {
            $outbound = $data['outbound_flight'];

            $departureAirportCode = Airports::find($data['departure_airport_id']);
            $arrivalAirportCode = Airports::find($data['arrival_airport_id']);
                //cần chỉnh chỉ cần lấy trong ngày tạo chuyến bay
                ///tạo chuyến sau thời gian hạ cánh có thể gần thời gian cất cánh của chuyến trước
            $flightTime = Flights::where('airline_id', $data['airline_id'])
                ->where(function ($q) use ($outbound) {
                    $q->where('departure_time', '<=', $outbound['arrival_time'])
                      ->where('arrival_time', '>=', Carbon::parse($outbound['departure_time'])->subMinute(30));
                })
                ->get();
            if($flightTime->count() >0){
                return response()->json(
                    [
                        'message' => 'Khoảng thời gian này đã có chuyến bay tồn tại (Mỗi chuyến bay cách nhau ít nhất 30 phút).'
                    ],
                    200
                );
            }

            $flight = Flights::create([
                'airline_id' => $data['airline_id'],
                'departure_airport_id'  => $data['departure_airport_id'],
                'arrival_airport_id'  => $data['arrival_airport_id'],
                'departure_time'  => $outbound['departure_time'],
                'arrival_time'  => $outbound['arrival_time'],
                'flight_number'  => $departureAirportCode->code . '-' . $arrivalAirportCode->code . '-' . now()->timestamp,
            ]);


            $seats = Seats::where('airline_id',  $data['airline_id'])
                ->where('status', 'usable')
                ->select('id', 'seat_number', 'seat_class_id')
                ->get();
            $seatByFlights = [];
            foreach ($seats as $key => $value) {
                if (in_array($value['seat_class_id'], array_column($outbound['seat_classes'], 'id'))) {
                    $seatByFlights[] = [
                        'flight_id' => $flight->id,
                        'seat_number' => $value['seat_number'],
                        'seat_id' => $value['id'],
                        'price' => $this->PriceSeatBySeatclasses($value['seat_class_id'],  $outbound['seat_classes']),
                    ];
                }
            }
            if (!empty($seatByFlights)) SeatFlights::insert($seatByFlights);

            $valueSeatFlights = SeatFlights::where('flight_id', $flight->id)
                ->join('seats as s', 'seat_flights.seat_id', 's.id')
                ->select(
                    'flight_id',
                    's.seat_class_id as class_id',
                    'price',
                    DB::raw('COUNT(*) as total_seats')
                )
                ->groupBy('s.seat_class_id', 'price', 'flight_id')
                ->get();
            $ticket = [];
            foreach ($valueSeatFlights as $value) {
                $ticket[] = [
                    'flight_id' => $value->flight_id,
                    'class_id' => $value->class_id,
                    'price' => $value->price,
                    'total_seats' => $value->total_seats,
                    'available_seats' => $value->total_seats
                ];
            }
            if (!empty($ticket)) Tickets::insert($ticket);

            DB::commit();
            return response()->json(
                [
                    'message' => 'Thêm chuyến bay thành công.'
                ],
                200
            );
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(
                [
                    'message' => 'Thêm chuyến bay thất bại.' . $e
                ],
                500
            );
        }
    }
    public function update(CreateFlightRequest $request, $id)
    {
        $data = $request->all();
        DB::beginTransaction();
        try {
            $flight = Flights::find($id);
            if (!$flight) {
                return response()->json([
                    'message' => 'Chuyến bay không tồn tại.'
                ], 404);
            }

            // Không cho phép cập nhật khi đã có vé được đặt
            $hasBooked = Tickets::where('flight_id', $id)
                ->whereRaw('available_seats < total_seats')
                ->exists();
            if ($hasBooked) {
                return response()->json([
                    'message' => 'Không thể cập nhật vì có vé đã được đặt.'
                ], 400);
            }
            // Support nested outbound_flight payload for updates and fall back to current flight values
            $outbound = $data['outbound_flight'] ?? null;
            $depTime = $outbound['departure_time'] ?? $data['departure_time'] ?? $flight->departure_time ?? null;
            $arrTime = $outbound['arrival_time'] ?? $data['arrival_time'] ?? $flight->arrival_time ?? null;
            $airlineId = $data['airline_id'] ?? $flight->airline_id;
            $departureAirportId = $data['departure_airport_id'] ?? $flight->departure_airport_id;
            $arrivalAirportId = $data['arrival_airport_id'] ?? $flight->arrival_airport_id;

            // Kiểm tra khoảng thời gian (loại trừ chuyến hiện tại) — chỉ khi cả departure và arrival có giá trị
            if ($depTime && $arrTime) {
                $flightTime = Flights::where('airline_id', $airlineId)
                    ->where('id', '!=', $id)
                    ->where(function ($q) use ($depTime, $arrTime) {
                        $q->whereBetween('departure_time', [$depTime, $arrTime])
                            ->orWhereBetween('arrival_time', [Carbon::parse($depTime)->subMinute(30), $arrTime]);
                    })
                    ->get();

                foreach ($flightTime as $item) {
                    $departureTime = Carbon::parse($depTime);
                    $arrivalTime = Carbon::parse($arrTime);
                    if (
                        $departureTime->between(Carbon::parse($item->departure_time), Carbon::parse($item->arrival_time)->addMinute(30)) ||
                        $arrivalTime->between(Carbon::parse($item->departure_time), Carbon::parse($item->arrival_time))
                    ) {
                        return response()->json([
                            'message' => 'Khoảng thời gian này đã có chuyến bay tồn tại (Mỗi chuyến bay cách nhau ít nhất 30 phút).'
                        ], 200);
                    }
                }
            }

            $oldAirlineId = $flight->airline_id;

            // Cập nhật dữ liệu chuyến (sử dụng outbound nếu có, hoặc giữ giá trị cũ nếu không cung cấp)
            $flight->airline_id = $airlineId;
            $flight->departure_airport_id = $departureAirportId;
            $flight->arrival_airport_id = $arrivalAirportId;
            if ($depTime) $flight->departure_time = $depTime;
            if ($arrTime) $flight->arrival_time = $arrTime;

            // Lookup airport codes using effective IDs and build flight_number safely
            $departureAirportCode = Airports::find($departureAirportId);
            $arrivalAirportCode = Airports::find($arrivalAirportId);
            $depCode = $departureAirportCode && isset($departureAirportCode->code) ? $departureAirportCode->code : 'XX';
            $arrCode = $arrivalAirportCode && isset($arrivalAirportCode->code) ? $arrivalAirportCode->code : 'XX';
            $flight->flight_number = $depCode . '-' . $arrCode . '-' . now()->timestamp;
            $flight->save();

            // Nếu đổi hãng, recreate seat_flights cho chuyến
            if ($oldAirlineId != $airlineId) {
                SeatFlights::where('flight_id', $flight->id)->delete();
                $seats = Seats::where('airline_id', $airlineId)
                    ->where('status', 'usable')
                    ->select('id', 'seat_number', 'seat_class_id')
                    ->get();

                $seatClassesForPrices = $outbound['seat_classes'] ?? $data['seat_classes'] ?? [];
                $seatByFlights = [];
                foreach ($seats as $value) {
                    $seatByFlights[] = [
                        'flight_id' => $flight->id,
                        'seat_number' => $value['seat_number'],
                        'seat_id' => $value['id'],
                        'price' => $this->PriceSeatBySeatclasses($value['seat_class_id'], $seatClassesForPrices),
                    ];
                }
                if (!empty($seatByFlights)) SeatFlights::insert($seatByFlights);
            } else {
                // Nếu chỉ cập nhật giá (seat_classes) thì cập nhật giá trên seat_flights
                $seatClassesForUpdate = $outbound['seat_classes'] ?? ($data['seat_classes'] ?? null);
                if (!empty($seatClassesForUpdate)) {
                    $seatFlights = SeatFlights::where('flight_id', $flight->id)->get();
                    foreach ($seatFlights as $sf) {
                        $seat = Seats::find($sf->seat_id);
                        if ($seat) {
                            $sf->price = $this->PriceSeatBySeatclasses($seat->seat_class_id, $seatClassesForUpdate);
                            $sf->save();
                        }
                    }
                }
            }

            // Rebuild tickets for the flight
            Tickets::where('flight_id', $flight->id)->delete();

            $valueSeatFlights = SeatFlights::where('flight_id', $flight->id)
                ->join('seats as s', 'seat_flights.seat_id', 's.id')
                ->select(
                    'flight_id',
                    's.seat_class_id as class_id',
                    'price',
                    DB::raw('COUNT(*) as total_seats')
                )
                ->groupBy('s.seat_class_id', 'price', 'flight_id')
                ->get();
            $ticket = [];
            foreach ($valueSeatFlights as $value) {
                $ticket[] = [
                    'flight_id' => $value->flight_id,
                    'class_id' => $value->class_id,
                    'price' => $value->price,
                    'total_seats' => $value->total_seats,
                    'available_seats' => $value->total_seats
                ];
            }
            if (!empty($ticket)) Tickets::insert($ticket);

            DB::commit();
            return response()->json([
                'message' => 'Cập nhật chuyến bay thành công.'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật chuyến bay thất bại.' . $e
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $flight = Flights::find($id);
            if (!$flight) {
                return response()->json([
                    'message' => 'Chuyến bay không tồn tại.'
                ], 404);
            }

            // Nếu có vé đã được đặt thì không cho xóa
            $hasBooked = Tickets::where('flight_id', $id)
                ->whereRaw('available_seats < total_seats')
                ->exists();
            if ($hasBooked) {
                return response()->json([
                    'message' => 'Không thể xóa vì có vé đã được đặt.'
                ], 400);
            }

            Tickets::where('flight_id', $id)->delete();
            SeatFlights::where('flight_id', $id)->delete();
            $flight->delete();

            DB::commit();
            return response()->json([
                'message' => 'Xóa chuyến bay thành công.'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Xóa chuyến bay thất bại.' . $e
            ], 500);
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
}
