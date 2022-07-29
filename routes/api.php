<?php

  use App\Http\Controllers\AuctionController;
  use App\Http\Controllers\AuthController;
  use App\Http\Controllers\BidController;
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
//Auction
  Route::controller(AuctionController::class)->group(function () {
    Route::get('/getauction', 'auctionListView');
  });

//Product
  Route::controller(ProductController::class)->group(function () {
    Route::get('/auction-products/{id}', 'auctionProducts');
  });

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

//  Anonymous User
  Route::controller(AuctionController::class)->group(function () {
    Route::get('/auction', 'index');
    Route::get('/auction/{id}', 'show');
  });

  Route::controller(ProductController::class)->group(function () {
    Route::get('/product', 'index');
    Route::get('/product/{id}', 'show');
//    Route::get('/auction-products/{id}', 'auctionProducts');
  });

  Route::controller(SessionController::class)->group(function () {
    Route::get('/session', 'index');
    Route::get('/session/{id}', 'show');
  });

//  Authenticated user
  Route::group([
    'middleware' => 'isUser'
  ], function () {
    Route::controller(BidController::class)->group(function () {
      Route::get('/bid', 'index');
      Route::get('/bid/{id}', 'show');
      Route::post('/bid', 'store');
    });

  });

//  Admin
  Route::group([
    'prefix' => 'admin',
    'middleware' => 'isAdmin'
  ], function () {
    Route::controller(UserController::class)->group(function () {
      Route::get('/user', 'index');
      Route::get('/user/{id}', 'show');
      Route::post('/user', 'store');
      Route::put('/user/{id}', 'update');
      Route::delete('/user/{id}', 'destroy');
    });

    Route::controller(AuctionController::class)->group(function () {
      Route::post('/auction', 'store');
      Route::put('/auction/{id}', 'update');
      Route::delete('/auction/{id}', 'destroy');
    });

    Route::controller(ProductController::class)->group(function () {
      Route::post('/product', 'store');
      Route::put('/product/{id}', 'update');
      Route::delete('/product/{id}', 'destroy');
    });

    Route::controller(SessionController::class)->group(function () {
      Route::post('/session', 'store');
      Route::put('/session/{id}', 'update');
      Route::delete('/session/{id}', 'destroy');
    });

    Route::controller(BidController::class)->group(function () {
      Route::get('/bid', 'index');
      Route::get('/bid/{id}', 'show');
      Route::post('/bid', 'store');
      Route::put('/bid/{id}', 'update');
      Route::delete('/bid/{id}', 'destroy');
    });
  });

  Route::group([
    'prefix' => 'auth'
  ], function () {
    Route::controller(AuthController::class)->group(function () {
      Route::post('/login', 'login');
      Route::post('/register', 'register');
      Route::post('/logout', 'logout');
      Route::post('/refresh', 'refresh');
      Route::get('/user-profile', 'userProfile');
      Route::post('/change-pass', 'changePassword');
    });

  });
