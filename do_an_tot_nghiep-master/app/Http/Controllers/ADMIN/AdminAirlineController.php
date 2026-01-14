<?php

namespace App\Http\Controllers\ADMIN;

use App\Helpers\CloudinaryUpload;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAirlineRequest;
use App\Models\Airlines;
use App\Models\Seats;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminAirlineController extends Controller
{
    public function index()
    {
        $url = env('CLOUDINARY_URL_AIRLINE');
        $airlines = Airlines::select(
            'airlines.*',
            DB::raw("CONCAT('$url/', image) as image")
        )
            ->get();
        return response()->json($airlines);
    }
    public function show($id)
    {
        try {
            $url = env('CLOUDINARY_URL_AIRLINE');
            $airline = Airlines::select(
                'airlines.*',
                DB::raw("CONCAT('$url/', image) as image")
            )
                ->where('id', $id)
                ->get();
            return response()->json($airline);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Không tìm thấy máy bay.'
            ], 404);
        }
    }

    public function store(CreateAirlineRequest $request)
    {
        
        DB::beginTransaction();
        $file = $request->file('image');
        $res = CloudinaryUpload::upload($file, 'airlines', 'airline');
        if ($res) {
            $imageName = $res['display_name'] . '.' . $res['format'];
            try {
                $airline = Airlines::create([
                    'name' => $request->input('name'),  
                    'code' => $request->input('code'),
                    'image' =>  $imageName,
                    'type' => $request->input('type'),
                    'registration_code' => $request->input('registration_code'),
                    'seat_rows' => $request->input('seat_rows'),
                    'seat_per_row' => $request->input('seat_per_row'),
                ]);
                return response()->json([
                    'message' => 'Thêm máy bay thành công.'
                ], 200);
            } catch (Exception $e) {
                Log::error($e->getMessage());
                return response()->json([
                    'message' => 'Thêm máy bay thất bại.'
                ], 500);
            }
            DB::commit();
        } else {
            DB::rollBack();
            return response()->json([
                'message' => 'Lưu ảnh thất bại.'
            ], 500);
        }
    }

    public function update(CreateAirlineRequest $request, $id)
    {
        try {
            $airline = Airlines::find($id);
            if (!$airline) {
                return response()->json([
                    'message' => 'Không tìm thấy máy bay.'
                ], 404);
            }
            $imageName = $airline->image;
            if ($request->hasFile('image')) {
                $res = CloudinaryUpload::upload($request->file('image'), 'airlines', 'airline');
                if ($res) {
                    $imageName = $res['display_name'] . '.' . $res['format'];
                } else {
                    return response()->json([
                        'message' => 'Cập nhật ảnh thất bại.'
                    ], 500);
                }
            }
            $airline->update([
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'image' =>  $imageName,
                'type' => $request->input('type'),
                'registration_code' => $request->input('registration_code'),
                'seat_rows' => $request->input('seat_rows'),
                'seat_per_row' => $request->input('seat_per_row'),
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
            $airline = Airlines::find($id);
            $seatByAirline = Seats::where('airline_id', $id)->delete();
            if (!$airline) {
                return response()->json([
                    'message' => 'Không tìm thấy máy bay.'
                ], 404);
            }
            $airline->delete();
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
