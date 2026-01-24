<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\Baggage_rules;
use App\Http\Requests\StoreBaggageRuleRequest;
use App\Http\Requests\UpdateBaggageRuleRequest;
use Exception;
use Illuminate\Http\Request;

class AdminBaggageRuleController extends Controller
{
    public function index()
    {
        try {
            $rules = Baggage_rules::with('seatClass')->get();

            return response()->json([
                'message' => 'Lấy danh sách quy định hành lý thành công.',
                'data' => $rules,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy danh sách quy định hành lý thất bại.'
            ], 500);
        }
    }

    public function store(StoreBaggageRuleRequest $request)
    {
        try {
            $rule = Baggage_rules::create($request->validated());

            return response()->json([
                'message' => 'Tạo quy định hành lý thành công.',
                'data' => $rule,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Tạo quy định hành lý thất bại.'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $rule = Baggage_rules::with('seatClass')->find($id);

            if (! $rule) {
                return response()->json(['message' => 'Quy định hành lý không tồn tại.'], 404);
            }

            return response()->json([
                'message' => 'Lấy thông tin quy định hành lý thành công.',
                'data' => $rule,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy thông tin quy định hành lý thất bại.'
            ], 500);
        }
    }

    public function getByClass($classId)
    {
        try {
            $rules = Baggage_rules::with('seatClass')
                ->where('class_id', $classId)
                ->get();

            if ($rules->isEmpty()) {
                return response()->json([
                    'message' => 'Không có quy định hành lý cho hạng này.',
                    'data' => [],
                ]);
            }

            return response()->json($rules);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Lấy quy định hành lý thất bại.'
            ], 500);
        }
    }

    public function update(UpdateBaggageRuleRequest $request, $id)
    {
        try {
            $rule = Baggage_rules::find($id);

            if (! $rule) {
                return response()->json(['message' => 'Quy định hành lý không tồn tại.'], 404);
            }
            $rule->update($request->validated());

            return response()->json([
                'message' => 'Cập nhật quy định hành lý thành công.',
                'data' => $rule,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Cập nhật quy định hành lý thất bại.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $rule = Baggage_rules::find($id);

            if (! $rule) {
                return response()->json(['message' => 'Quy định hành lý không tồn tại.'], 404);
            }

            $rule->delete();

            return response()->json([
                'message' => 'Xóa quy định hành lý thành công.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Xóa quy định hành lý thất bại.'
            ], 500);
        }
    }
}
