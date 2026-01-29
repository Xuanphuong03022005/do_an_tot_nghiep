<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDiscountRequest;
use App\Http\Requests\UpdateDiscountRequest;
use App\Models\Discounts;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminDiscountController extends Controller
{
    /**
     * Lấy danh sách mã giảm giá
     */
    public function index(Request $request): JsonResponse
    {
        $query = Discounts::query();

        // Lọc theo status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Lọc theo loại mã giảm giá
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Tìm kiếm theo code hoặc description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // Sắp xếp
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Phân trang
        $perPage = $request->get('per_page', 10);
        $discounts = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách mã giảm giá thành công',
            'data' => $discounts
        ], 200);
    }

    /**
     * Lấy chi tiết một mã giảm giá
     */
    public function show($id): JsonResponse
    {
        $discount = Discounts::find($id);

        if (!$discount) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không tồn tại'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết mã giảm giá thành công',
            'data' => $discount
        ], 200);
    }

    /**
     * Tạo mã giảm giá mới
     */
    public function store(StoreDiscountRequest $request): JsonResponse
    {
        try {
            // Kiểm tra code đã tồn tại chưa
            if (Discounts::where('code', $request->code)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá này đã tồn tại'
                ], 409);
            }

            $discount = Discounts::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Tạo mã giảm giá thành công',
                'data' => $discount
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo mã giảm giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật mã giảm giá
     */
    public function update(UpdateDiscountRequest $request, $id): JsonResponse
    {
        try {
            $discount = Discounts::find($id);

            if (!$discount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không tồn tại'
                ], 404);
            }

            // Kiểm tra code đã được dùng bởi discount khác không
            if ($request->has('code') && $request->code !== $discount->code) {
                if (Discounts::where('code', $request->code)->exists()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Mã giảm giá này đã tồn tại'
                    ], 409);
                }
            }

            $discount->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật mã giảm giá thành công',
                'data' => $discount
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật mã giảm giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa mã giảm giá
     */
    public function destroy($id): JsonResponse
    {
        try {
            $discount = Discounts::find($id);

            if (!$discount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không tồn tại'
                ], 404);
            }

            $discount->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa mã giảm giá thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa mã giảm giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Kiểm tra mã giảm giá có hợp lệ không
     */
    public function validateCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'order_amount' => 'required|numeric|min:0'
        ]);

        $discount = Discounts::where('code', $request->code)->first();

        if (!$discount) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không tồn tại'
            ], 404);
        }

        if (!$discount->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá này không còn hợp lệ'
            ], 400);
        }

        if (!$discount->canBeUsedFor($request->order_amount)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã giảm giá không áp dụng cho đơn hàng này. Tối thiểu: ' . $discount->min_order_amount
            ], 400);
        }

        $discountAmount = $discount->getDiscountAmount($request->order_amount);
        $finalAmount = $request->order_amount - $discountAmount;

        return response()->json([
            'success' => true,
            'message' => 'Mã giảm giá hợp lệ',
            'data' => [
                'discount_id' => $discount->id,
                'discount_code' => $discount->code,
                'discount_type' => $discount->type,
                'discount_value' => $discount->value,
                'discount_amount' => $discountAmount,
                'original_amount' => $request->order_amount,
                'final_amount' => $finalAmount,
                'description' => $discount->description
            ]
        ], 200);
    }

    /**
     * Áp dụng mã giảm giá (tăng số lần sử dụng)
     */
    public function applyDiscount($id): JsonResponse
    {
        try {
            $discount = Discounts::find($id);

            if (!$discount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không tồn tại'
                ], 404);
            }

            if (!$discount->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không còn hợp lệ để sử dụng'
                ], 400);
            }

            $discount->incrementUsedCount();

            return response()->json([
                'success' => true,
                'message' => 'Áp dụng mã giảm giá thành công',
                'data' => [
                    'id' => $discount->id,
                    'code' => $discount->code,
                    'used_count' => $discount->used_count,
                    'usage_limit' => $discount->usage_limit,
                    'remaining' => $discount->usage_limit - $discount->used_count
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi áp dụng mã giảm giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thay đổi trạng thái mã giảm giá
     */
    public function changeStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,inactive,expired'
        ]);

        try {
            $discount = Discounts::find($id);

            if (!$discount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không tồn tại'
                ], 404);
            }

            $discount->status = $request->status;
            $discount->save();

            return response()->json([
                'success' => true,
                'message' => 'Thay đổi trạng thái thành công',
                'data' => $discount
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thay đổi trạng thái: ' . $e->getMessage()
            ], 500);
        }
    }
}