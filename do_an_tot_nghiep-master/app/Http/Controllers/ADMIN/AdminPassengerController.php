<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Passengers;
use Exception;
use App\Http\Requests\StorePassengerRequest;
use App\Http\Requests\UpdatePassengerRequest;
use Illuminate\Http\Request;

class AdminPassengerController extends Controller
{
    public function index()
    {
        try {
            $passengers = Passengers::all();
            return response()->json([
                'message' => 'Lấy danh sách hành khách thành công.',
                'data' => $passengers,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy danh sách hành khách thất bại.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $passenger = Passengers::find($id);

            if (! $passenger) {
                return response()->json(['message' => 'Hành khách không tồn tại.'], 404);
            }

            return response()->json([
                'message' => 'Lấy thông tin hành khách thành công.',
                'data' => $passenger,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy thông tin hành khách thất bại.'
            ], 500);
        }
    }

    public function update(UpdatePassengerRequest $request, $id)
    {
        try {
            $passenger = Passengers::find($id);

            if (! $passenger) {
                return response()->json(['message' => 'Hành khách không tồn tại.'], 404);
            }

            $passenger->update($request->validated());

            return response()->json([
                'message' => 'Cập nhật hành khách thành công.',
                'data' => $passenger,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Cập nhật hành khách thất bại.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $passenger = Passengers::find($id);

            if (! $passenger) {
                return response()->json(['message' => 'Hành khách không tồn tại.'], 404);
            }

            $passenger->delete();

            return response()->json([
                'message' => 'Xóa hành khách thành công.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Xóa hành khách thất bại.'
            ], 500);
        }
    }
}
