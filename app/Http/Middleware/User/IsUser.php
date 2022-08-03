<?php

namespace App\Http\Middleware\User;

use Closure;
use Illuminate\Http\Request;

class IsUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
      $user = $request->user();
      if($user !== null && $user->hasRole('user'))
      {
        return $next($request);
      }
      return response()->json([
        'status' => false,
        'message' => 'Unauthorized',
      ], Response::HTTP_UNAUTHORIZED);
    }
}
