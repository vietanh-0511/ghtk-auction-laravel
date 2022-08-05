<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $users = User::query()->orderByDesc('id')->get();
        return Responder::success($users, 'get users success');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        try {
            $user = User::create($validated);
        } catch (Exception $e) {
            return Responder::fail($validated, $e->getMessage());
        }
        $user->assignRole('user');
        return Responder::success($user, 'store success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the user with the id ' . $id . ' does not exist.');
        }
        $user = User::where('id', $id)->first();
        return Responder::success($user, 'get users success');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $validated = $request->validated();
        try {
            $userUpdated = User::where('id', $id)->update($validated);
        } catch (Exception $e) {
            return Responder::fail($validated, $e->getMessage());
        }
        return Responder::success($userUpdated, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the user with the id ' . $id . ' does not exist.');
        }
        $deleteUser = User::where('id', $id)->delete();
        return Responder::success($deleteUser, 'delete success');
    }

}
