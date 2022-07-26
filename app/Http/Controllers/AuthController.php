<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Response;
use App\Models\User;

class AuthController extends Controller
{
  public function __construct()
  {
    $this->middleware('auth:api', ['except' => ['login', 'register']]);
  }

  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();
    if (!$token = auth()->attempt($credentials)) {
      return response()->json([
        'status' => false,
        'message' => 'Unauthorized',
        'data' => null,
      ], 401);
    }
    return $this->createNewToken($token);
  }

  public function register(RegisterRequest $request)
  {
    $user = User::create($request->validated());
    $user->assignRole('user');

    return response()->json([
      'status' => true,
      'message' => 'Signup successful',
      'data' => $user,
    ], Response::HTTP_CREATED);
  }

  public function logout()
  {
    auth()->logout();
    return response()->json([
      'status' => true,
      'message' => 'Sign out successful',
    ], Response::HTTP_OK);
  }

  public function refresh()
  {
    return $this->createNewToken(auth()->refresh());
  }

  public function userProfile()
  {
    return response()->json([
      'status' => true,
      'message' => 'Success',
      'data' => auth()->user(),
    ], Response::HTTP_OK);
  }

  protected function createNewToken($token)
  {
    return response()->json([
      'status' => true,
      'message' => 'Refresh token successful',
      'access_token' => $token,
      'expires_in' => auth()->factory()->getTTL() * 60,
      'data' => auth()->user(),
    ], Response::HTTP_OK);
  }

  public function changePassword(ChangePasswordRequest $request)
  {
    $userId = auth()->user()->id;
    $user = User::where('id', $userId)->update(
      ['password' => bcrypt($request->new_password)]
    );
    return response()->json([
      'status' => true,
      'message' => 'User successfully changed password',
      'data' => [
        'id' => $userId
        ],
    ], Response::HTTP_OK);
  }
}
