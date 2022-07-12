<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// user CRUD
Route::controller(UserController::class)->group(function () {
    Route::get('/user', 'index');
    Route::get('/user/{id}', 'show');
    Route::post('/user', 'store');
    Route::put('/user/{id}', 'update');
    Route::delete('/user/{id}', 'destroy');
});

//auction CRUD routes
Route::controller(AuctionController::class)->group(function () {
    Route::get('/auction', [AuctionController::class, 'index']);
    Route::get('/auction/{id}', [AuctionController::class, 'show']);
    Route::post('/auction', [AuctionController::class, 'store']);
    Route::put('/auction/{id}', [AuctionController::class, 'update']);
    Route::delete('/auction/{id}', [AuctionController::class, 'destroy']);
});
