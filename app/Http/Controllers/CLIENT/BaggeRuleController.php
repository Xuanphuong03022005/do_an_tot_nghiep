<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Baggage_rules;
use Illuminate\Http\Request;

class BaggeRuleController extends Controller
{
    public function index()
    {
        $baggageRules = Baggage_rules::all();
        return response()->json($baggageRules);
    }
}
