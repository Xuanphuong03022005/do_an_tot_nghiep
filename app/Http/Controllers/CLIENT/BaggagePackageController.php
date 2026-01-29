<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Baggage_packages;
use Illuminate\Http\Request;

class BaggagePackageController extends Controller
{
    public function index()
    {
        $baggagePackages = Baggage_packages::all();
        return response()->json($baggagePackages);
    }
}
