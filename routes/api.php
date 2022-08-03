<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SessionController;
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

//  Admin
  Route::group([
    'prefix' => 'admin',
//    'middleware' => 'isAdmin',
  ], function () {

    Route::controller(UserController::class)->group(function () {
      Route::get('/user', 'index');
      Route::get('/user/{id}', 'show');
      Route::post('/user', 'store');
      Route::put('/user/{id}', 'update');
      Route::delete('/user/{id}', 'destroy');
    });

    Route::controller(AuctionController::class)->group(function () {
      Route::get('/auction', 'index');
      Route::get('/auction/{id}', 'show');
      Route::post('/auction', 'store');
      Route::put('/auction/{id}', 'update');
      Route::delete('/auction/{id}', 'destroy');
    });

    Route::controller(ProductController::class)->group(function () {
      Route::get('/product', 'index');
      Route::get('/product/{id}', 'show');
      Route::post('/product', 'store');
      Route::put('/product/{id}', 'update');
      Route::delete('/product/{id}', 'destroy');
    });

    Route::controller(SessionController::class)->group(function () {
      Route::get('/session', 'index');
      Route::get('/session/{id}', 'show');
      Route::post('/session', 'store');
      Route::put('/session/{id}', 'update');
      Route::delete('/session/{id}', 'destroy');
    });

  });

//  Authenticated User
  Route::group([
//    'middleware' => 'isUser',
  ], function () {

    Route::controller(BidController::class)->group(function () {
      Route::get('/bid', 'index');
      Route::get('/bid/{id}', 'show');
      Route::post('/bid', 'store');
      Route::put('/bid/{id}', 'update');
      Route::delete('/bid/{id}', 'destroy');
    });

    Route::controller(AuctionController::class)->group(function () {
      Route::get('/getauction', 'auctionListView');
    });

    Route::controller(ProductController::class)->group(function () {
      Route::get('/auction-products/{id}', 'auctionProducts');
    });

  });

//  Anonymous User


Route::group([
  'prefix' => 'auth'
], function () {
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::post('/refresh', [AuthController::class, 'refresh']);
  Route::get('/user-profile', [AuthController::class, 'userProfile']);
  Route::post('/change-pass', [AuthController::class, 'changePassword']);
});
