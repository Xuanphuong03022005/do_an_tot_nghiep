<?php

use App\Http\Controllers\ADMIN\AdminAirlineController;
use App\Http\Controllers\ADMIN\AdminAirpotsController;
use App\Http\Controllers\ADMIN\AdminFlightsController;
use App\Http\Controllers\ADMIN\AdminSeatClassesController;
use App\Http\Controllers\ADMIN\AdminSeatController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::get('/', function () {
    return view('welcome');
});
Route::prefix('admin')->group(function () {
    //airline
    Route::post('/airline', [AdminAirlineController::class, 'store']);
    Route::post('/airline/update/{id}', [AdminAirlineController::class, 'update']);
    Route::get('/airline', [AdminAirlineController::class, 'index']);
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
    Route::resource('airports', AdminAirpotsController::class);
    //flight
    Route::post('/flight', [AdminFlightsController::class, 'store']);
});
