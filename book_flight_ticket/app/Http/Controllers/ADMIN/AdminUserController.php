<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;
use Illuminate\Support\Facades\DB;

class AdminUserController extends Controller
{
    // AdminUserController.php

public function index(Request $request)
{
    try {
        $perPage = $request->query('per_page');
        $email = $request->query('email'); // Lấy tham số email từ URL

        $query = User::select('id','name','email','phone','address','role','created_at','updated_at')
                     ->orderBy('id','asc');

        // Thêm điều kiện tìm kiếm nếu có email
        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($perPage) {
            $data = $query->paginate((int) $perPage);
        } else {
            $data = $query->get();
        }
        return response()->json($data, 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Lấy danh sách người dùng thất bại.'], 500);
    }
}

    public function update(UpdateUserRequest $request, $id)
    {
        $validated = $request->validated();

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
        }

        DB::beginTransaction();
        try {

            if (isset($validated['name'])) $user->name = $validated['name'];
            if (isset($validated['email'])) $user->email = $validated['email'];
            if (array_key_exists('password', $validated) && $validated['password']) {
                $user->password = Hash::make($validated['password']);
            }
            if (array_key_exists('phone', $validated)) $user->phone = $validated['phone'];
            if (array_key_exists('address', $validated)) $user->address = $validated['address'];
            if (array_key_exists('role', $validated)) $user->role = $validated['role'];

            $user->save();
            DB::commit();
            $user->makeHidden(['password']);
            return response()->json(['message' => 'Cập nhật người dùng thành công.', 'data' => $user], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Cập nhật người dùng thất bại.'], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
            }

            $user->delete();
            DB::commit();
            return response()->json(['message' => 'Xóa người dùng thành công.'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Xóa người dùng thất bại.'], 500);
        }
    }
    // AdminUserController.php
public function bookingHistory($id)
{
    try {
        // Sử dụng Eloquent để lấy đầy đủ quan hệ ticket -> flight và ticket -> seat_class
        // Điều này giúp lấy được flight_number và hạng ghế cho React
        $history = \App\Models\Bookings::with(['ticket.flight', 'ticket.seat_class'])
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($history, 200);
    } catch (Exception $e) {
        return response()->json(['message' => 'Lỗi lấy lịch sử: ' . $e->getMessage()], 500);
    }
}
// Thêm mới User (Mặc định set role = 1 để làm quản trị viên)
public function store(StoreUserRequest $request) 
{
    $validated = $request->validated();
    
    DB::beginTransaction();
    try {
        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->address = $validated['address'] ?? null;
        $user->password = Hash::make($validated['password']);
        $user->role = 1; // Mặc định là Admin khi tạo từ trang quản trị
        $user->save();

        DB::commit();
        return response()->json(['message' => 'Thêm quản trị viên thành công.', 'data' => $user], 201);
    } catch (Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
    }
}
}