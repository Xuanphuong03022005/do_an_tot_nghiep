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
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('per_page');
            $query = User::select('id','name','email','phone','address','role','created_at','updated_at')->orderBy('id','asc');
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
}