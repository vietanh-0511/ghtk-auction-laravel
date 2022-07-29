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
    $this->middleware('auth:api', ['except' => ['login', 'adminLogin', 'register']]);
  }

  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();
    if (!$token = auth()->attempt($credentials)) {
      return response()->json([
        'status' => false,
        'message' => 'Unauthorized',
        'data' => null,
      ], Response::HTTP_UNAUTHORIZED);
    }
    return $this->createNewToken($token, 'Signin successful');
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

  protected function createNewToken($token, $message='Refresh token successful')
  {
    $data = auth()->user()->toArray();
    $data['role'] = auth()->user()->getRoleNames()->first();
    return response()->json([
      'status' => true,
      'message' => $message,
      'access_token' => $token,
      'expires_in' => auth()->factory()->getTTL() * 60,
      'data' => $data,
    ], Response::HTTP_OK);
  }

  public function changePassword(ChangePasswordRequest $request)
  {
    $userId = auth()->user()->id;
    User::where('id', $userId)->update(
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
