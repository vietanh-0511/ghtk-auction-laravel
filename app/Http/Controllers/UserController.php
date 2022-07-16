<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApiLoginRequest;
use App\Http\Requests\ApiRegisterRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Supports\Responder;
use Exception;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return Responder::success($users, 'get users success');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ApiRegisterRequest $request)
    {
        try {
            $user = User::create($request->all());
        } catch (Exception $e) {
            return Responder::fail($user, $e->getMessage());
        }
        $user->assignRole('user');
        return Responder::success($user, 'store success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $users = User::findOrFail($id);
        } catch (Exception $e) {
            return Responder::fail($users, $e->getMessage());
        }
        return Responder::success($users, 'get users success');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $userUpdated = User::where('id', $id)->update($request->all());
        } catch (Exception $e) {
            return Responder::fail($userUpdated, $e->getMessage());
        }
        return Responder::success($userUpdated, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            User::where('id', $id)->delete();
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function login(ApiLoginRequest $request)
    {
        if (Auth::guard('web')->attempt([
            'email' => $request->email,
            'password' => $request->password,
        ])) {
            $user = User::where('email', $request->email)->first();
            $user->token = $user->createToken('App')->accessToken;
            return response()->json($user);
        }
        return response()->json(['message' => 'Wrong email or password!'], 401);
    }
}
