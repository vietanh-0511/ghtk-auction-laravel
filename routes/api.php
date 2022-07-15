<?php

    use App\Http\Controllers\ApiUserController;
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

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::controller(ApiUserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::get('/user', 'show')->middleware('auth:api');
//Route::put('/user', [ApiUserController::class, 'update'])->middleware('auth:api');
    Route::post('/logout', 'logout')->middleware('auth:api');
    Route::put('/user/change-password', 'changePassword')->middleware('auth:api');
});
