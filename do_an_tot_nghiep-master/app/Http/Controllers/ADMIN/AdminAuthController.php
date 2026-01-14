<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminAuthController extends Controller
{
    // Hàm đăng ký cho User
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'birthday' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Tạo mã hội viên ngẫu nhiên (Ví dụ: BC12345678)
        $memberId = 'BC' . rand(10000000, 99999999);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'birthday' => $request->birthday,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu
            'role' => '1', // Mặc định là Hội viên
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'memberId' => $memberId,
            'user' => $user
        ], 201);
    }
public function login(Request $request) {
    // 1. Dùng validate để đảm bảo dữ liệu không bị null
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Vui lòng nhập đầy đủ email và mật khẩu'], 400);
    }

    // 2. Tìm user (Dùng trim để tránh lỗi khoảng trắng thừa)
    $user = User::where('email', trim($request->email))->first();

    // 3. Kiểm tra mật khẩu (Sử dụng Hash::check cho mật khẩu đã mã hóa)
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Email hoặc Mật Khẩu không chính xác.'], 401);
    }

    // 4. Tạo token và trả về cấu trúc chuẩn cho React
    $token = bin2hex(random_bytes(40)); 
    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role
        ]
    ], 200);
}

    // Hàm lấy danh sách User cho Admin
   public function getAllUsers() {
    $users = User::all();
    // Trả về trực tiếp mảng user
    return response()->json($users, 200); 
}
}