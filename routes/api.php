<?php

use App\Http\Controllers\ApiUserController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\UserController;
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



Route::group(
    ['prefix' => 'admin'],
    function () {

        //User 
        Route::controller(UserController::class)->group(function () {
            // Route::post('/login', 'login');
            Route::get('/user', 'index');
            Route::get('/user/{id}', 'show');
            Route::post('/user', 'store');
            Route::put('/user/{id}', 'update');
            Route::delete('/user/{id}', 'destroy');
        });

        //Auction  
        Route::controller(AuctionController::class)->group(function () {
            Route::get('/auction', 'index');
            Route::get('/auction/{id}', 'show');
            Route::post('/auction', 'store');
            Route::put('/auction/{id}', 'update');
            Route::delete('/auction/{id}', 'destroy');
        });

        //Product  
        Route::controller(ProductController::class)->group(function () {
            Route::get('/product', 'index');
            Route::get('/product/{id}', 'show');
            Route::post('/product', 'store');
            Route::put('/product/{id}', 'update');
            Route::delete('/product/{id}', 'destroy');
        });

        //Session
        Route::controller(SessionController::class)->group(function () {
            Route::get('/session', 'index');
            Route::get('/session/{id}', 'show');
            Route::post('/session', 'store');
            Route::put('/session/{id}', 'update');
            Route::delete('/session/{id}', 'destroy');
        });

        //Bid
        Route::controller(BidController::class)->group(function () {
            Route::get('/bid', 'index');
            Route::get('/bid/{id}', 'show');
            Route::post('/bid', 'store');
            Route::put('/bid/{id}', 'update');
            Route::delete('/bid/{id}', 'destroy');
        });
    }
);


Route::controller(ApiUserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login')->name('login');
    Route::get('/user', 'show')->middleware('auth:api');
    //Route::put('/user', [ApiUserController::class, 'update'])->middleware('auth:api');
    Route::post('/logout', 'logout')->middleware('auth:api');
    Route::put('/user/change-password', 'changePassword')->middleware('auth:api');
});
//Auction  
Route::controller(AuctionController::class)->group(function () {
    Route::get('/getauction', 'auctionListView');
});

//Product  
Route::controller(ProductController::class)->group(function () {
    Route::get('/auction-products/{id}', 'auctionProducts');
});
