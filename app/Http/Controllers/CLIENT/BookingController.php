<?php

namespace App\Http\Controllers\CLIENT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBookingRequest;
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
    /**
     * List bookings for a user (or all with no user_id)
     */
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

    /**
     * Show booking details including passengers and tickets
     */
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
        $validated = $request->validated();
        // Support one-way (flight_id) and round-trip (outbound_flight_id + return_flight_id)
        $isRound = !empty($validated['outbound_flight_id']) && !empty($validated['return_flight_id']);

        DB::beginTransaction();
        try {
            $totalAmount = 0;

            // First pass: check availability and ticket <-> flight consistency
            foreach ($validated['tickets'] as $t) {
                $ticket = Tickets::lockForUpdate()->find($t['ticket_id']);
                if (!$ticket) throw new Exception('Ticket không tồn tại.');

                // Determine expected flight id for this ticket
                $expectedFlight = null;
                if ($isRound) {
                    if (empty($t['type'])) {
                        throw new Exception('Thiếu trường `type` cho vé trong đặt khứ hồi.');
                    }
                    $expectedFlight = $t['type'] === 'return' ? $validated['return_flight_id'] : $validated['outbound_flight_id'];
                } else {
                    $expectedFlight = $validated['flight_id'] ?? null;
                }

                if ($expectedFlight && $ticket->flight_id != $expectedFlight) {
                    return response()->json(['message' => "Ticket id {$ticket->id} không thuộc flight id {$expectedFlight}."], 400);
                }

                $need = count($t['passengers']);
                if ($ticket->available_seats < $need) {
                    return response()->json(['message' => 'Không đủ ghế cho ticket id ' . $ticket->id], 400);
                }
                $totalAmount += $ticket->price * $need;
            }

            // Create round trip record if needed
            $roundTripId = null;
            if ($isRound) {
                $rt = RoundTrip::create();
                $roundTripId = $rt->id;
            }

            // Create booking (note: bookings table stores round_trip_id; flight_id column may not exist)
            $pnr = strtoupper(Str::random(6));
            $bookingId = DB::table('bookings')->insertGetId([
                'user_id' => $validated['user_id'] ?? null,
                'pnr_code' => $pnr . now(),
                'status' => 'booked',
                'round_trip_id' => $roundTripId,
                'total_amount' => $totalAmount,
                'discount_id' => null,
                'discount_value' => null,
                'total_final' => $totalAmount
            ]);

            // Create passengers and booking_tickets, decrement tickets.available_seats
            foreach ($validated['tickets'] as $t) {
                $ticket = Tickets::lockForUpdate()->find($t['ticket_id']);
                foreach ($t['passengers'] as $pData) {
                    $passengerId = DB::table('passengers')->insertGetId([
                        'name' => $pData['name'],
                        'gender' => $pData['gender'],
                        'birthday' => $pData['birthday'] ?? null,
                        'phone' => $pData['phone'] ?? null,
                        'email' => $pData['email'] ?? null,
                        'identity_type' => $pData['identity_type'] ?? null,
                        'identity_number' => $pData['identity_number'] ?? null
                    ]);

                    DB::table('booking_tickets')->insert([
                        'booking_id' => $bookingId,
                        'ticket_id' => $ticket->id,
                        'passenger_id' => $passengerId,
                        'flight_id' => $ticket->flight_id,
                        'seat_code' => $pData['seat_code'] ?? null,
                        'type' => $t['type'] ?? 'outbound',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    // decrement
                    DB::table('tickets')->where('id', $ticket->id)->decrement('available_seats', 1);
                }
            }

            DB::commit();
            $booking = DB::table('bookings')->where('id', $bookingId)->first();
            return response()->json(['message' => 'Đặt chỗ thành công.', 'data' => $booking], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đặt chỗ thất bại: ' . $e->getMessage()], 500);
        }
    }
}
