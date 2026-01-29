<?php

use App\Http\Controllers\ADMIN\AdminAirlineController;
use App\Http\Controllers\ADMIN\AdminAirportsController;
use App\Http\Controllers\ADMIN\AdminAirpotsController;
use App\Http\Controllers\ADMIN\AdminBaggagePackageController;
use App\Http\Controllers\ADMIN\AdminBaggageRuleController;
use App\Http\Controllers\ADMIN\AdminBookingController;
use App\Http\Controllers\ADMIN\AdminDashboardController;
use App\Http\Controllers\ADMIN\AdminDiscountController;
use App\Http\Controllers\ADMIN\AdminFlightsController;
use App\Http\Controllers\ADMIN\AdminPaymentController;
use App\Http\Controllers\ADMIN\AdminSeatClassesController;
use App\Http\Controllers\ADMIN\AdminSeatController;
use App\Http\Controllers\ADMIN\AdminTicketController;
use App\Http\Controllers\ADMIN\AdminUserController;
use App\Http\Controllers\CLIENT\BookingController;
use App\Http\Controllers\CLIENT\PaymentController;
use App\Http\Controllers\CLIENT\TicketController;
use App\Http\Controllers\CLIENT\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

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
    Route::resource('airports', AdminAirportsController::class);
    //flight
    Route::get('/flight/{id}', [AdminFlightsController::class, 'show']); 
    Route::post('/flight', [AdminFlightsController::class, 'store']);
    Route::delete('/flight/{id}', [AdminFlightsController::class, 'destroy']);
    Route::get('/flights', [AdminFlightsController::class, 'index']);
    Route::get('/flights-by-date', [AdminFlightsController::class, 'getFlightsByDate']);
    //user
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);     // Cho chức năng THÊM
    Route::put('/users/{id}', [AdminUserController::class, 'update']); // Cho chức năng SỬA
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']); // Cho chức năng XÓA
    
    Route::post('/users', [AdminUserController::class, 'store']); // Thêm dòng này để cho phép POST (Thêm mới)
    Route::put('/users/{id}', [AdminUserController::class, 'update']); // Đảm bảo đã có dòng này để cho phép cập nhật
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    Route::get('/users/{id}/history', [AdminUserController::class, 'bookingHistory']);
    //baggage rules
    Route::post('baggage-rules',[AdminBaggageRuleController::class, 'store']);
    Route::get('baggage-rules',[AdminBaggageRuleController::class, 'index']);
    Route::put('baggage-rules/{id}',[AdminBaggageRuleController::class, 'update']);
    Route::delete('baggage-rules/{id}',[AdminBaggageRuleController::class, 'destroy']);
    Route::get('baggage-rules/{id}',[AdminBaggageRuleController::class, 'show']);
    Route::get('baggage-rules-by-class/{id}',[AdminBaggageRuleController::class, 'getByClass']);
 
    //baggage_package
    Route::prefix('baggage-packages')->group(function () {
    Route::get('/', [AdminBaggagePackageController::class, 'index']);
    Route::get('/{id}', [AdminBaggagePackageController::class, 'show']);
    Route::post('/', [AdminBaggagePackageController::class, 'store']);
    Route::put('/{id}', [AdminBaggagePackageController::class, 'update']);
    Route::delete('/{id}', [AdminBaggagePackageController::class, 'destroy']);
    });
    //payment - booking pending
    Route::get('/booking-pending', [AdminPaymentController::class, 'bookingPending']);
    Route::get('/booking-pending/{id}', [AdminPaymentController::class, 'bookingPendingDetail']);
    Route::put('/change-status-booking/{id}', [AdminPaymentController::class, 'changeStatus']);
    //booking
   Route::get('/bookings', [AdminPaymentController::class, 'index']); 
    Route::put('/change-status-booking/{id}', [AdminPaymentController::class, 'changeStatus']);
    //tickets
    Route::get('/tickets', [AdminTicketController::class, 'index']);
    Route::delete('/tickets/{id}', [AdminTicketController::class, 'destroy']);
     Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [AdminTicketController::class, 'store']);
    Route::put('/tickets/{id}', [AdminTicketController::class, 'update']);

    Route::get('/dashboard/revenue-by-class', [AdminDashboardController::class, 'revenueByTicketClass']);
    Route::get('/dashboard/revenue-by-aircraft', [AdminDashboardController::class, 'revenueByAircraft']);
    Route::get('/dashboard/revenue-by-date', [AdminDashboardController::class, 'revenueByDate']);
    Route::get('/dashboard/revenue-by-route', [AdminDashboardController::class, 'revenueByRoute']);

      //discounts
    Route::get('/discounts', [AdminDiscountController::class, 'index']);
    Route::get('/discounts/{id}', [AdminDiscountController::class, 'show']);
    Route::post('/discounts', [AdminDiscountController::class, 'store']);
    Route::put('/discounts/{id}', [AdminDiscountController::class, 'update']);
    Route::delete('/discounts/{id}', [AdminDiscountController::class, 'destroy']);
    Route::post('/discounts/validate-code', [AdminDiscountController::class, 'validateCode']);
    Route::post('/discounts/{id}/apply', [AdminDiscountController::class, 'applyDiscount']);
    Route::put('/discounts/{id}/change-status', [AdminDiscountController::class, 'changeStatus']);
});
    Route::post('/user', [UserController::class, 'store']);
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::post('/login', [UserController::class, 'login']);
    
    //booking
    Route::post('/booking', [BookingController::class, 'store']);
    //payment 
    Route::post('/payment', [PaymentController::class, 'store']);