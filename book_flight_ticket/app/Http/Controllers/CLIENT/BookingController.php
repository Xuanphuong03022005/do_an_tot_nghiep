<?php

namespace App\Http\Controllers\CLIENT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Baggages;
use Illuminate\Support\Facades\DB;
use App\Models\Bookings;
use App\Models\BookingTickets;
use App\Models\Passengers;
use App\Models\Tickets;
use App\Models\RoundTrip;
use Exception;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('bookings')
            ->select('bookings.*', 'flights.flight_number', 'flights.departure_time', 'flights.arrival_time')
            ->leftJoin('flights', 'bookings.flight_id', '=', 'flights.id');

        if ($request->filled('user_id')) {
            $query->where('bookings.user_id', $request->user_id);
        }

        $perPage = (int) $request->get('per_page', 15);
        $data = $query->orderBy('bookings.created_at', 'desc')->paginate($perPage);
        return response()->json(['message' => 'Danh sách đặt chỗ', 'data' => $data], 200);
    }

    public function show($id)
    {
        $booking = DB::table('bookings')->where('id', $id)->first();
        if (!$booking) return response()->json(['message' => 'Booking không tồn tại.'], 404);

        $tickets = DB::table('booking_tickets as bt')
            ->select('bt.*', 't.price as ticket_price', 's.name as class_name')
            ->leftJoin('tickets as t', 'bt.ticket_id', '=', 't.id')
            ->leftJoin('seat_classes as s', 't.class_id', '=', 's.id')
            ->where('bt.booking_id', $id)
            ->get();

        $passengers = DB::table('passengers')->whereIn('id', $tickets->pluck('passenger_id'))->get();
        return response()->json(['message' => 'Chi tiết booking', 'data' => [
            'booking' => $booking,
            'tickets' => $tickets,
            'passengers' => $passengers
        ]], 200);
    }
    
    public function store(StoreBookingRequest $request)
    {
        DB::beginTransaction();
        do {
            $pnr = strtoupper(Str::random(6));
        } while (Bookings::where('pnr_code', $pnr)->exists());
        try {
            $data = $request->all();
            $booking = Bookings::create([
                'user_id' => $data['user_id'],
                'pnr_code' => $pnr,
                'status' => 'ticketed',
                'total_amount' => $data['total_amount'],
                'discount_id' => $data['discount_id'],
                'discount_value' => $data['discount_value'],
                'total_final' => $data['total_final'],
            ]);
            foreach ($data['tickets'] as $value) {
                $passengers = $value['passengers'];
                foreach ($passengers as $passenger) {
                    $dataPassenger = Passengers::create([
                        'name' => $passenger['name'],
                        'gender' => $passenger['gender'],
                        'phone' => $passenger['phone'],
                        'email' => $passenger['email'],
                        'type' => $passenger['type'],
                        'identity_type' => $passenger['identity_type'],
                        'identity_number' => $passenger['identity_number'],
                    ]);
                    $ticketOutbound = Tickets::where('flight_id', $data['outbound_flight_id'])->first();
                    if($ticketOutbound->available_seats <= 0){
                        return response()->json(['message' => 'Vé này đã hết. Vui lòng chọn vé khác hoặc chuyến bay khác.'], 400);
                    }
                    $bookingTicketOutbound = BookingTickets::create([
                        'booking_id' => $booking->id,
                        'ticket_id' => $value['ticket_id'],
                        'passenger_id' => $dataPassenger->id,
                        'flight_id' => $data['outbound_flight_id'],
                        'class_id' => $value['class_id'],
                        'type' => 'outbound'
                    ]);
                    $ticketOutbound->update([
                        'available_seats' => $ticketOutbound->available_seats - 1
                        ]);
                    if (isset($data['return_flight_id']) && $data['return_flight_id'] != null) {
                        $ticketReturn = Tickets::where('flight_id', $data['return_flight_id'])->first();
                        if($ticketReturn->available_seats <= 0){
                            return response()->json(['message' => 'Vé khứ hồi cho hạng này đã hết. Vui lòng chuyến bay khác.'], 400);
                        }
                        $bookingTicketReturn = BookingTickets::create([
                            'booking_id' => $booking->id,
                            'ticket_id' => $ticketReturn->id,
                            'passenger_id' => $dataPassenger->id,
                            'flight_id' => $data['return_flight_id'],
                            'class_id' => $value['class_id'],
                            'type' => 'return'
                        ]);
                        $ticketReturn->update([
                        'available_seats' => $ticketReturn->available_seats - 1
                    ]);
                    }
                    $bookingTicketId = $bookingTicketOutbound->id;

                    if (!empty($passenger['baggage'])) {
                        foreach ($passenger['baggage'] as $item) {
                            $bookingTicketId = $bookingTicketOutbound->id;
                            if (
                                $item['flight_type'] === 'return'
                                && isset($bookingTicketReturn)
                            ) {
                                $bookingTicketId = $bookingTicketReturn->id;
                            }

                            Baggages::create([
                                'booking_ticket_id' => $bookingTicketId,
                                'type' => $item['type'],
                                'weight' => $item['weight'],
                                'price' => $item['price'],
                                'note' => $item['note'] ?? null
                            ]);
                        }
                    }
                }
                DB::commit();
                return response()->json(['message' => 'Đặt chỗ thành công.', 'data' => [$booking->pnr_code]], 200);
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đặt chỗ thất bại. ' . $e->getMessage()], 500);
        }
    }
}
