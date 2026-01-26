<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Tickets;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminTicketController extends Controller
{
public function index(Request $request) {
    $query = Tickets::with('seat_class');
    
    if ($request->has('airline_id')) {
        $query->where('airline_id', $request->airline_id);
    }
    
    // FIX TẠI ĐÂY: Chỉ lấy những vé là cấu hình mẫu của máy bay
    $query->whereNull('flight_id'); 

    $data = $query->orderBy('id', 'desc')->get();
    return response()->json(['message' => 'Danh sách cấu hình vé', 'data' => $data], 200);
}

public function store(Request $request) {
    // 1. Kiểm tra trùng hạng vé (Chỉ check những bản ghi chưa xóa)
    $classExists = Tickets::where('airline_id', $request->airline_id)
        ->where('class_id', $request->class_id)
        ->whereNull('flight_id')
        ->exists();

    if ($classExists) {
        return response()->json(['message' => 'Lỗi: Hạng vé này đã tồn tại!'], 422);
    }

    // 2. Kiểm tra trùng lặp hàng ghế
    $overlap = Tickets::where('airline_id', $request->airline_id)
        ->whereNull('flight_id')
        ->where(function ($query) use ($request) {
            $query->whereBetween('row_start', [$request->row_start, $request->row_end])
                  ->orWhereBetween('row_end', [$request->row_start, $request->row_end]);
        })->exists();

    if ($overlap) {
        return response()->json(['message' => 'Lỗi: Khoảng hàng ghế này đã được phân bổ!'], 422);
    }

    DB::beginTransaction();
    try {
        // 3. Thực hiện lưu dữ liệu vào bảng tickets
        $ticket = Tickets::create([
            'airline_id'      => $request->airline_id,
            'flight_id'       => null,
            'class_id'        => $request->class_id,
            'total_seats'     => $request->total_seats,
            'available_seats' => $request->total_seats,
            'price'           => $request->input('price', 0),
            'row_start'       => $request->row_start,
            'row_end'         => $request->row_end,
        ]);

        // 4. Cập nhật bảng seats vật lý (Cột seat_class_id)
        DB::table('seats')
            ->where('airline_id', $request->airline_id)
            ->whereBetween('row_number', [$request->row_start, $request->row_end])
            ->update(['seat_class_id' => $request->class_id]);

        DB::commit();
        return response()->json(['message' => 'Cấu hình hạng vé thành công', 'data' => $ticket], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
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
        // Sửa từ delete() thành forceDelete() để xóa hẳn khỏi DB
        $ticket->forceDelete(); 
        return response()->json(['message' => 'Xóa vĩnh viễn thành công.'], 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Xóa thất bại.'], 500);
    }
}
  
}
