<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBaggagePackageRequest;
use App\Models\Baggage_packages;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminBaggagePackageController extends Controller
{
    /**
     * Get all baggage packages
     */
    public function index()
    {
        try {
            $packages = Baggage_packages::all();
            return response()->json([
                'message' => 'Danh sách gói hành lý.',
                'data' => $packages
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy danh sách gói hành lý thất bại.'
            ], 500);
        }
    }

    /**
     * Get a specific baggage package
     */
    public function show($id)
    {
        try {
            $package = Baggage_packages::find($id);
            if (!$package) {
                return response()->json([
                    'message' => 'Gói hành lý không tồn tại.'
                ], 404);
            }

            return response()->json([
                'message' => 'Chi tiết gói hành lý.',
                'data' => $package
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy chi tiết gói hành lý thất bại.'
            ], 500);
        }
    }

    /**
     * Create a new baggage package
     */
    public function store(CreateBaggagePackageRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $package = Baggage_packages::create([
                'weight' => $data['weight'],
                'price' => $data['price'],
                'max_length' => $data['max_length'],
                'max_width' => $data['max_width'],
                'max_height' => $data['max_height']
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Tạo gói hành lý thành công.',
                'data' => $package
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Tạo gói hành lý thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a baggage package
     */
    public function update(CreateBaggagePackageRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $package = Baggage_packages::find($id);
            if (!$package) {
                return response()->json([
                    'message' => 'Gói hành lý không tồn tại.'
                ], 404);
            }

            $data = $request->validated();

            $package->update([
                'weight' => $data['weight'] ?? $package->weight,
                'price' => $data['price'] ?? $package->price,
                'max_length' => $data['max_length'] ?? $package->max_length,
                'max_width' => $data['max_width'] ?? $package->max_width,
                'max_height' => $data['max_height'] ?? $package->max_height
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Cập nhật gói hành lý thành công.',
                'data' => $package
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Cập nhật gói hành lý thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a baggage package
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $package = Baggage_packages::find($id);
            if (!$package) {
                return response()->json([
                    'message' => 'Gói hành lý không tồn tại.'
                ], 404);
            }

            $package->delete();

            DB::commit();
            return response()->json([
                'message' => 'Xóa gói hành lý thành công.'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Xóa gói hành lý thất bại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
