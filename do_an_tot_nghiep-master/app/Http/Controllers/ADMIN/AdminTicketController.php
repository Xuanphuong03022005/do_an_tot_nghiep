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
    $query = Tickets::with('seatClass'); 

    // 2. Lọc theo airline_id gửi từ React
    if ($request->has('airline_id')) {
        $query->where('airline_id', $request->airline_id);
    }
    
    if ($request->has('class_id')) {
        $query->where('class_id', $request->class_id);
    }

    $perPage = (int) $request->get('per_page', 15);
    // Lấy data và trả về cấu trúc đồng nhất
    $data = $query->orderBy('id', 'desc')->paginate($perPage);
    
    return response()->json([
        'message' => 'Danh sách vé',
        'data' => $data // Trả về toàn bộ object paginate
    ], 200);
}

public function getSeatClasses()
{
    try {
        // Sử dụng Model thay vì Query Builder để đồng bộ
        $classes = \App\Models\SeatClasses::select('id', 'name')->get();
        return response()->json($classes, 200);
    } catch (Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}
    // Thêm hàm này vào AdminTicketController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'airline_id'  => 'required',
        'class_id'    => 'required',
        'price'       => 'required|numeric|min:0',
        'total_seats' => 'required|integer|min:1',
        // XÓA DÒNG flight_id Ở ĐÂY
    ]);

    try {
        $ticket = Tickets::create([
            'airline_id'      => $validated['airline_id'],
            'class_id'        => $validated['class_id'],
            'price'           => $validated['price'],
            'total_seats'     => $validated['total_seats'],
            'available_seats' => $validated['total_seats'],
            // XÓA DÒNG 'flight_id' Ở ĐÂY
        ]);

        return response()->json(['message' => 'Phân bổ vé thành công', 'data' => $ticket], 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
    }
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
