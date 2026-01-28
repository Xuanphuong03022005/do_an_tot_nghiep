<?php

namespace App\Http\Controllers\ADMIN;

use App\Http\Controllers\Controller;
use App\Models\BookingTickets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardContrroller extends Controller
{
    public function revenueByTicketClass()
    {
       $data = BookingTickets::where('created_at', '=' , now()->month())
            ->get();

        return response()->json($data);
    }
}
