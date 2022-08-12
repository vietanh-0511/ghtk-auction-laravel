<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\VerifyEmail;
use App\Services\Mail\SendVerifyMail;
use App\Services\Mail\VerifyMailAction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
  private $sendVerifyMail;
  private $verifyMail;
  public function __construct(SendVerifyMail $sendVerifyMail, VerifyMailAction $verifyMail)
  {
    $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyEmail', 'resendVerifyMail']]);
    $this->sendVerifyMail = $sendVerifyMail;
    $this->verifyMail = $verifyMail;
  }

  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();
    if (!$token = auth()->attempt($credentials)) {
      return response()->json([
        'status' => false,
        'message' => 'Wrong email or password.',
        'data' => null,
      ], Response::HTTP_UNAUTHORIZED);
    }
    if (!User::where('email', $credentials['email'])->where('email_verified_at','!=', null)->exists()) {
      return response()->json([
        'status' => false,
        'message' => 'Email not verified.',
        'data' => null,
      ], Response::HTTP_UNAUTHORIZED);
    }
    return $this->createNewToken($token, 'Signin successful');
  }

  public function register(RegisterRequest $request)
  {
    $user = User::create($request->validated());
    $user->assignRole('user');
    $this->sendVerifyMail->handle([
      'full_name' => $user->full_name,
      'email' => $user->email,
      'token' => $this->genVerifyMailToken($user->id)
    ]);
    return response()->json([
      'status' => true,
      'message' => 'Signup successful, Please check your email!',
      'data' => $user,
    ], Response::HTTP_CREATED);
  }

  public function verifyEmail(Request $request)
  {
    $token = $request->query('token');
    $verifyMail = $this->verifyMail->handle($token);
    return $verifyMail['isValid']
      ? redirect(env('APP_URL').':8002/app/login')
      : redirect(env('APP_URL').':8002/app');
  }

  private function genVerifyMailToken(int $user_id)
  {
    $token = Str::random(60);
    VerifyEmail::create([
      'user_id' => $user_id,
      'token' => $token,
    ]);
    return $token;
  }

  public function resendVerifyMail(Request $request)
  {
    $user = User::query()->where('email', $request->email)->first();
    if (is_null($user)) {
      return response()->json([
        'status' => false,
        'message' => 'Email does not exist',
        'data' => null,
      ], Response::HTTP_NOT_ACCEPTABLE);
    }
    if(!is_null($user->email_verified_at)) {
      return response()->json([
        'status' => false,
        'message' => 'Email verified',
        'data' => null,
      ], Response::HTTP_NOT_ACCEPTABLE);
    };
    VerifyEmail::query()->where('user_id', $user->id)->delete();
    $this->sendVerifyMail->handle([
      'full_name' => $user->full_name,
      'email' => $user->email,
      'token' => $this->genVerifyMailToken($user->id)
    ]);
    return response()->json([
      'status' => true,
      'message' => 'Sent verify email',
      'data' => null,
    ]);
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
