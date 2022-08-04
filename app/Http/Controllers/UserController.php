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
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
<<<<<<< Updated upstream
        // $limit = $request->limit;
        // $users = User::paginate($limit);
=======
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
>>>>>>> Stashed changes
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
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        try {
            $user = User::create($validated);
        } catch (Exception $e) {
<<<<<<< Updated upstream
            return $e->getMessage();
=======
            return Responder::fail($validated, $e->getMessage());
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        try {
            $users = User::findOrFail($id);
        } catch (Exception $e) {
            return $e->getMessage();
=======
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the user with the id ' . $id . ' does not exist.');
>>>>>>> Stashed changes
        }
        $user = User::where('id', $id)->first();
        return Responder::success($user, 'get users success');
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
        $validated = $request->validated();
        try {
            $userUpdated = User::where('id', $id)->update($validated);
        } catch (Exception $e) {
<<<<<<< Updated upstream
            return $e->getMessage();
=======
            return Responder::fail($validated, $e->getMessage());
>>>>>>> Stashed changes
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
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the user with the id ' . $id . ' does not exist.');
        }
        $deleteUser = User::where('id', $id)->delete();
        return Responder::success($deleteUser, 'delete success');
    }

}
