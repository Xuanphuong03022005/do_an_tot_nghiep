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

class AdminFlightsController extends Controller
{
    public function store(CreateFlightRequest $request)
    {
        $data = $request->all();
        DB::beginTransaction();
        try {
            $departureAirportCode = Airports::find($data['departure_airport_id']);
            $arrivalAirportCode = Airports::find($data['arrival_airport_id']);
            $flightTime = Flights::where('airline_id', $data['airline_id'])
                ->whereBetween('departure_time',  [$data['departure_time'],  $data['arrival_time']])
                ->OrwhereBetween('arrival_time',  [Carbon::parse($data['departure_time'])->subMinute(30),  $data['arrival_time']])
                ->get();
            foreach ($flightTime as  $item) {
                $departureTime = Carbon::parse($data['departure_time']);
                $arrivalTime = Carbon::parse($data['arrival_time']);
                if (
                    $departureTime->between(Carbon::parse($item->departure_time), Carbon::parse($item->arrival_time)->addMinute(30)) ||
                    $arrivalTime->between(Carbon::parse($item->departure_time), Carbon::parse($item->arrival_time))
                ) {
                    return response()->json(
                        [
                            'message' =>  'Khoảng thời gian này đã có chuyến bay tồn tại (Mỗi chuyến bay cách nhau ít nhất 30 phút).'
                        ],
                        200
                    );
                }
            }
            
            $flight = Flights::create([
                'airline_id' => $data['airline_id'],
                'departure_airport_id'  => $data['departure_airport_id'],
                'arrival_airport_id'  => $data['arrival_airport_id'],
                'departure_time'  => $data['departure_time'],
                'arrival_time'  => $data['arrival_time'],
                'flight_number'  => $departureAirportCode->code . '-' . $arrivalAirportCode->code . '-' . now()->timestamp,
            ]);
            $seats = Seats::where('airline_id',  $data['airline_id'])
                ->where('status', 'usable')
                ->select('id', 'seat_number', 'seat_class_id')
                ->get();

            $seatByFlights = [];
            foreach ($seats as $key => $value) {
                $seatByFlights[] = [
                    'flight_id' => $flight->id,
                    'seat_number' => $value['seat_number'],
                    'seat_id' => $value['id'],
                    'price' => $this->PriceSeatBySeatclasses($value['seat_class_id'],  $data['seat_classes']),
                ];
            }
            SeatFlights::insert($seatByFlights);
            $valueSeatFlights = SeatFlights::where('flight_id', $flight->id)
                ->join('seats as s', 'seat_flights.seat_id', 's.id')
                ->select(
                    'flight_id',
                    's.seat_class_id as class_id',
                    'price',
                    DB::raw('COUNT(*) as total_seats'),
                )
                ->groupBy('s.seat_class_id')
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
            Tickets::insert($ticket);
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
