<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Seats;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminSeatController extends Controller
{
    public function index($ailine_id)
    {
        try {
           $seats = Seats::where('airline_id', $ailine_id)
           ->select('id','airline_id', 'seat_class_id', 'row_number', 'seat_position', 'seat_number', 'status')->get();
            return response()->json($seats);
        } catch (Exception $e) {
            Log::error($e);
            return response()->json([
                'message' => 'Không tìm thấy.'
            ], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $data = [];
            $airline_id = $request->input('airline_id');
            $position = $request->input('position');
            $array = json_decode($request->input('array_seat_classes'), true);
            foreach ($array as $item) {
                for ($i = $item['row_start']; $i <= $item['row_end']; $i++) {
                    for ($j = 1; $j <= $position; $j++) { 
                       $data []=[
                            'airline_id' => $airline_id,
                            'seat_class_id' => $item['seat_class_id'],
                            'row_number' => $i,
                            'seat_position' => chr(64 + $j),
                            'seat_number' => $i . chr(64 + $j),
                        ];
                    }
                }
            }
            Seats::insert($data);
            return response()->json([
                'message' => 'Thêm thành công.'
            ], 200);
        } catch (Exception $e) {
            Log::error($e);
            return response()->json([
                'message' => 'Thêm thất bại.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $seat = Seats::find($id);
            return response()->json($seat);
        } catch (Exception $e) {
            Log::error($e);
            return response()->json([
                'message' => 'Không tìm thấy.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $seat = Seats::find($id);
            if (!$seat) {
                return response()->json([
                    'message' => 'Không tìm thấy ghế.'
                ], 404);
            }

            $seat->update([
                'seat_class_id' => $request->input('seat_class_id'),
                'status' => $request->input('status'),
            ]);
            return response()->json([
                'message' => 'Cập nhật thành công.'
            ], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Cập nhật thất bại.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $seat = Seats::find($id);
            if (!$seat) {
                return response()->json([
                    'message' => 'Không tìm thấy ghế.'
                ], 404);
            }
            $seat->delete();
            return response()->json([
                'message' => 'Xoá thành công.'
            ], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Xoá thất bại.'
            ], 500);
        }
    }
}
