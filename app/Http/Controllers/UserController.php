<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Supports\Responder;
use Carbon\Carbon;
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
        return Responder::success($users, 'Lấy thành công');
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
        $validated['email_verified_at'] = Carbon::now();
        try {
            $user = User::create($validated);
        } catch (Exception $e) {
            return Responder::fail($validated, $e->getMessage());
        }
        $user->assignRole('user');
        return Responder::success($user, 'Lưu thành công');
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
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Người dùng không tồn tại');
        }
        $user = User::where('id', $id)->first();
        return Responder::success($user, 'Lấy thành công');
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
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Người dùng không tồn tại');
        }
        try {
            $userUpdated = User::where('id', $id)->update($validated);
        } catch (Exception $e) {
            return Responder::fail($validated, $e->getMessage());
        }
        return Responder::success($userUpdated, 'Sửa thành công');
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
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!User::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Người dùng không tồn tại');
        }
        $user = User::find($id);
        if ($user->hasRole('admin')) {
            return Responder::fail($id, 'Không thể xóa tài khoản admin');
        }
        User::query()->where('id', $id)->update([
            'email' => $user->email . '_deleted'.rand(0,100000)
        ]);
        $deleteUser = User::where('id', $id)->delete();
        return Responder::success($deleteUser, 'Xóa thành công');
    }

}
