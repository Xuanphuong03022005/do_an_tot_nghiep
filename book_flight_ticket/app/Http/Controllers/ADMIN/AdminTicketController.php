<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Tickets;
use App\Models\Flight;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminTicketController extends Controller
{
  

public function index(Request $request) {
    $query = Tickets::with(['seat_class', 'flight']);

    if ($request->has('airline_id')) {
        $airlineId = $request->airline_id;

        $query->whereHas('flight', function($q) use ($airlineId) {
            $q->where('airline_id', $airlineId);
        });
    }

    $data = $query->orderBy('id', 'desc')->get();
    return response()->json(['message' => 'Danh sách vé theo máy bay', 'data' => $data], 200);
}

    public function store(Request $request) {
    $request->validate([
        'flight_id' => 'required|exists:flights,id',
        'class_id'  => 'required',
        'total_seats' => 'required|integer|min:1',
        'price' => 'required|numeric|min:0',
    ]);

    // 1. Lấy thông tin chuyến bay và máy bay liên quan để biết giới hạn ghế
 $flight = \App\Models\Flights::with('airline')->find($request->flight_id);
    if (!$flight || !$flight->airline) {
        return response()->json(['message' => 'Lỗi: Không tìm thấy dữ liệu máy bay.'], 422);
    }

    // TÍNH TOÁN LẠI TỔNG GHẾ (Vì DB không có cột total_seats)
    $maxSeats = (int)$flight->airline->seat_rows * (int)$flight->airline->seat_per_row;

    // 2. Tính tổng ghế đã phân bổ hiện tại cho chuyến bay này
    $currentAllocated = Tickets::where('flight_id', $request->flight_id)->sum('total_seats');

    // 3. Kiểm tra logic: (Đã có + Sắp thêm) > Tối đa
    if (($currentAllocated + $request->total_seats) > $maxSeats) {
        return response()->json([
            'message' => "Lỗi: Tổng số ghế phân bổ (" . ($currentAllocated + $request->total_seats) . ") vượt quá sức chứa máy bay ($maxSeats)!"
        ], 422);
    }

    // 4. Kiểm tra xem hạng vé này đã tồn tại trong chuyến bay chưa
    $classExists = Tickets::where('flight_id', $request->flight_id)
        ->where('class_id', $request->class_id)
        ->exists();

    if ($classExists) {
        return response()->json(['message' => 'Lỗi: Hạng vé này đã tồn tại trong chuyến bay!'], 422);
    }

    DB::beginTransaction();
    try {
        $ticket = Tickets::create([
            'flight_id'       => $request->flight_id,
            'class_id'        => $request->class_id,
            'total_seats'     => $request->total_seats,
            'available_seats' => $request->total_seats,
            'price'           => $request->price,
        ]);

        DB::commit();
        return response()->json(['message' => 'Cấu hình hạng vé thành công', 'data' => $ticket], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
    }
}

    public function show($id) {
        $ticket = Tickets::with(['seat_class', 'flight'])->find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }
        return response()->json(['message' => 'Chi tiết ticket', 'data' => $ticket], 200);
    }

    public function update(Request $request, $id) {
        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }

        $validated = $request->validate([
            'price' => 'nullable|numeric|min:0',
            'total_seats' => 'nullable|integer|min:1',
            'available_seats' => 'nullable|integer|min:0',
        ]);

        try {
            if (isset($validated['price'])) $ticket->price = $validated['price'];
            if (isset($validated['total_seats'])) {
                $ticket->total_seats = $validated['total_seats'];
            }
            if (isset($validated['available_seats'])) {
                $ticket->available_seats = $validated['available_seats'];
            }

            $ticket->save();
            return response()->json(['message' => 'Cập nhật thành công.', 'data' => $ticket], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Cập nhật thất bại.'], 500);
        }
    }
    

    public function destroy($id) {
        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json(['message' => 'Ticket không tồn tại.'], 404);
        }

        try {
            // Vì không có row_start/row_end, chúng ta không thể giải phóng bảng 'seats' ở đây
            // Bạn sẽ phải quản lý việc gán hạng cho từng ghế ở một Module khác (Seat Manager)
            $ticket->delete(); 

            return response()->json(['message' => 'Xóa hạng vé thành công.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Xóa thất bại: ' . $e->getMessage()], 500);
        }
    }
    
}