<?php

use App\Http\Controllers\ADMIN\AdminAirlineController;
use App\Http\Controllers\ADMIN\AdminAirportsController;
use App\Http\Controllers\ADMIN\AdminBaggageRuleController;
use App\Http\Controllers\ADMIN\AdminFlightsController;
use App\Http\Controllers\ADMIN\AdminSeatClassesController;
use App\Http\Controllers\ADMIN\AdminSeatController;
use App\Http\Controllers\ADMIN\AdminUserController;
use App\Http\Controllers\ADMIN\AdminTicketController;
use App\Http\Controllers\CLIENT\TicketController;
use App\Http\Controllers\CLIENT\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::get('/', function () {
    return view('welcome');
});
  //auth
    Route::post('/register', [\App\Http\Controllers\ADMIN\AdminAuthController::class, 'register']);
    Route::get('/users', [App\Http\Controllers\ADMIN\AdminAuthController::class, 'getAllUsers']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/flights/search', [AdminFlightsController::class, 'search']);
Route::prefix('admin')->group(function () {
    //airline
    Route::get('/airline', [AdminAirlineController::class, 'index']); // Route này trả về ds máy bay
    Route::post('/airline', [AdminAirlineController::class, 'store']);
    Route::post('/airline/{id}', [AdminAirlineController::class, 'update']);
    Route::get('/airline/{id}', [AdminAirlineController::class, 'show']);
    Route::delete('/airline/{id}', [AdminAirlineController::class, 'destroy']);
    //seat_classes
    Route::post('/seat-classes', [AdminSeatClassesController::class, 'store']);
    Route::put('/seat-classes/{id}', [AdminSeatClassesController::class, 'update']);
    Route::get('/seat-classes', [AdminSeatClassesController::class, 'index']);
    Route::get('/seat-classes/{id}', [AdminSeatClassesController::class, 'show']);
    Route::delete('/seat-classes/{id}', [AdminSeatClassesController::class, 'destroy']);
    //seat
    Route::post('/seat', [AdminSeatController::class, 'store']);
    Route::get('/seat/{id}', [AdminSeatController::class, 'show']);
    Route::get('/seat-by-airline/{airline_id}', [AdminSeatController::class, 'index']);
    Route::put('/seat/{id}', [AdminSeatController::class, 'update']);
    Route::delete('/seat/{id}', [AdminSeatController::class, 'destroy']);
    //airpost
    Route::resource('airports', AdminAirportsController::class);
    //flight
    Route::delete('flight/{id}', [AdminFlightsController::class, 'destroy']);
     Route::post('/flight', [AdminFlightsController::class, 'store']);
    Route::get('/flights', [AdminFlightsController::class, 'index']);
    Route::get('/flight/{id}', [AdminFlightsController::class, 'show']);

    Route::get('/seat-classes', [AdminTicketController::class, 'getSeatClasses']);
    Route::get('/tickets', [AdminTicketController::class, 'index']);
    Route::post('/tickets', [AdminTicketController::class, 'store']);
    Route::put('tickets/{id}', [AdminTicketController::class, 'update']); // Đảm bảo dùng {id}
    Route::delete('tickets/{id}', [AdminTicketController::class, 'destroy']);

    //user
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    //baggage rules
    Route::post('baggage-rules',[AdminBaggageRuleController::class, 'store']);
    Route::get('baggage-rules',[AdminBaggageRuleController::class, 'index']);
    Route::put('baggage-rules/{id}',[AdminBaggageRuleController::class, 'update']);
    Route::delete('baggage-rules/{id}',[AdminBaggageRuleController::class, 'destroy']);
    Route::get('baggage-rules/{id}',[AdminBaggageRuleController::class, 'show']);
    Route::get('baggage-rules-by-class/{id}',[AdminBaggageRuleController::class, 'getByClass']);

});
    Route::post('/user', [UserController::class, 'store']);
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::post('/login', [UserController::class, 'login']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);