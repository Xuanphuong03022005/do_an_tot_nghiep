<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\SeatClasses;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function index()
    {
        $classes = SeatClasses::all();
        return response()->json($classes);
    }
}
