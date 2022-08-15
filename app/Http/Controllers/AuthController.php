<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Jobs\SendQueueVerifyEmail;
use App\Models\User;
use App\Models\VerifyEmailToken;
use App\Services\Mail\VerifyEmailAction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
  private $verifyEmailAction;
  public function __construct(VerifyEmailAction $verifyEmailAction)
  {
    $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyEmail', 'resendVerifyEmail']]);
    $this->verifyEmailAction = $verifyEmailAction;
  }

  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();
    if (!$token = auth()->attempt($credentials)) {
      return response()->json([
        'status' => false,
        'message' => 'Sai tài khoản hoặc mật khẩu!',
        'data' => null,
      ], Response::HTTP_UNAUTHORIZED);
    }
    if (!User::where('email', $credentials['email'])->where('email_verified_at','!=', null)->exists()) {
      return response()->json([
        'status' => false,
        'message' => 'Email chưa được xác minh!',
        'data' => null,
      ], Response::HTTP_UNAUTHORIZED);
    }
    return $this->createNewToken($token, 'Đăng nhập thành công!');
  }

  public function register(RegisterRequest $request)
  {
    $user = User::create($request->validated());
    $user->assignRole('user');
    dispatch(new SendQueueVerifyEmail([
      'full_name' => $user->full_name,
      'email' => $user->email,
      'token' => $this->genVerifyEmailToken($user->id),
    ]));
    return response()->json([
      'status' => true,
      'message' => 'Đăng ký thành công, vui lòng kiểm tra email của bạn!',
      'data' => $user,
    ], Response::HTTP_CREATED);
  }

  public function verifyEmail(Request $request)
  {
    $token = $request->query('token');
    $verifyMail = $this->verifyEmailAction->handle($token);
    return $verifyMail['isValid']
      ? redirect(env('APP_URL').'/app/login')
      : redirect(env('APP_URL').'/app');
  }

  private function genVerifyEmailToken(int $user_id)
  {
    $token = Str::random(60);
    VerifyEmailToken::create([
      'user_id' => $user_id,
      'token' => $token,
    ]);
    return $token;
  }

  public function resendVerifyEmail(Request $request)
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
    VerifyEmailToken::query()->where('user_id', $user->id)->delete();
    dispatch(new SendQueueVerifyEmail([
      'full_name' => $user->full_name,
      'email' => $user->email,
      'token' => $this->genVerifyEmailToken($user->id),
    ]));
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
