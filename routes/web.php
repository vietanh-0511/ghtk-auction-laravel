<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/request_auction', function () {
    return view('user/request_auction');
});

Route::post('/request_auction', [ProductController::class, 'store']);

//list autions
Route::get('/auction', [AuctionController::class, 'auctionListView']);

Route::get('/bid_view/{id}', [BidController::class, 'bidView']);
