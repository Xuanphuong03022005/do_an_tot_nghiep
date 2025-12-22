<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\SeatClasses;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminSeatClassesController extends Controller
{
    public function index()
    {
        $seatClasses = SeatClasses::all();
        return response()->json($seatClasses);
    }
    
    public function show($id)
    {
        try {
            $seatClasses = SeatClasses::find($id);
            return response()->json($seatClasses);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Không tìm thấy hạng này.'
            ], 404);
        }
    }

    public function store(Request $request)
    {
            try {
                $seatClasse = SeatClasses::create([
                    'name' =>  $request->input('name'),
                    'description' =>  $request->input('description')
                ]);
                 return response()->json([
                    'message' => 'Thêm hạng thành công.'
                ], 200);
            } catch (Exception $e) {
                Log::error($e->getMessage());
                return response()->json([
                    'message' => 'Thêm hạng thất bại.'
                ], 500);
            }
     
    }

    public function update(Request $request, $id)
    {
        try {
            $seatClasse = SeatClasses::find($id);
            if (!$seatClasse) {
                return response()->json([
                    'message' => 'Không tìm thấy hạng.'
                ], 404);
            }
           
            $seatClasse->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
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
            $seatClasse = SeatClasses::find($id);
            if (!$seatClasse) {
                return response()->json([
                    'message' => 'Không tìm thấy hạng.'
                ], 404);
            }
            $seatClasse->delete();
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
