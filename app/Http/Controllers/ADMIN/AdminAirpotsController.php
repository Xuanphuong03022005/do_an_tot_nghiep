<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Airports;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminAirpotsController extends Controller
{
    public function index()
    {
        try {
            $airpots = Airports::all();
            return response()->json($airpots);
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
            $airpots = Airports::create([
                'name' => $request->input('name'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
                'code' => $request->input('code'),
            ]);
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
            $airpots = Airports::find($id);
            return response()->json($airpots);
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
            $airpots = Airports::find($id);
            if (!$airpots) {
                return response()->json([
                    'message' => 'Không tìm thấy sân bay.'
                ], 404);
            }

            $airpots->update([
               'name' => $request->input('name'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
                'code' => $request->input('code'),
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
            $airpots = Airports::find($id);
            if (!$airpots) {
                return response()->json([
                    'message' => 'Không tìm thấy ghế.'
                ], 404);
            }
            $airpots->delete();
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
