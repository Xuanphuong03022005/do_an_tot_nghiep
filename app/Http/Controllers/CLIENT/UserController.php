<?php

namespace App\Http\Controllers\CLIENT;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);
            DB::commit();
            $user->makeHidden(['password']);
            return response()->json(['message' => 'Thêm người dùng thành công.', 'data' => $user], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Thêm người dùng thất bại.'], 500);
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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Thông tin đăng nhập không hợp lệ.'], 401);
        }
        $user->makeHidden(['password']);
        return response()->json([
            'message' => 'Đăng nhập thành công.',
            'data' => [
                'user' => $user
            ]
        ], 200);
    }
}
