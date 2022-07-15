<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApiChangePasswordRequest;
use App\Http\Requests\ApiLoginRequest;
use App\Http\Requests\ApiRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ApiUserController extends Controller
{
    public function __construct()
    {

    }

    public function register(ApiRegisterRequest $request)
    {
        $user = User::create($request->all());
        $user->assignRole('user');
        return response()->json([
            'data' => $user,
            'message' => 'Success',
        ], Response::HTTP_OK);
    }

    public function login(ApiLoginRequest $request)
    {
        if (Auth::guard('web')->attempt([
            'email' => $request['email'],
            'password' => $request['password'],
        ])) {
            $user = User::where('email', $request['email'])->first();
            $user->token = $user->createToken('App')->accessToken;
            return response()->json([
                "message" => "Success",
                "data" => $user,
            ], Response::HTTP_OK);
        }
        return response()->json(['message' => 'Wrong email or password!'], Response::HTTP_UNAUTHORIZED);
    }

    public function logout()
    {
        $user = Auth::user()->token();
        $user->revoke();
        return response()->json(['message' => 'Success'], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Request $request)
    {
        return response()->json([
            "message" => "Success",
            "data" => $request->user('api'),
        ], Response::HTTP_OK);
    }

    // Đổi pass xong k login được luôn :>
    public function changePassword(ApiChangePasswordRequest $request)
    {
        $user = Auth::user();
        $user['password'] = $request['new_password'];
        $user->save();
        return response()->json([
            "message"  => "Success",
        ], Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
