<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSessionRequest;
use App\Http\Requests\UpdateSessionRequest;
use App\Models\Session;
use App\Services\Session\CreateSessionAction;
use App\Services\Session\UpdateSessionAction;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;

class SessionController extends Controller
{

    private $createSessionAction;
    private $updateSessionAction;

    public function __construct(
        CreateSessionAction $createSessionAction,
        UpdateSessionAction $updateSessionAction
    ) {
        $this->createSessionAction = $createSessionAction;
        $this->updateSessionAction = $updateSessionAction;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // $limit  = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $sessions = Session::query()->orderByDesc('id')->get();
        return Responder::success($sessions, 'get sessions success');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreSessionRequest $request)
    {
        $validated = $request->validated();
        $session = '';
        try {
            $session = $this->createSessionAction->handle($validated);
        } catch (Exception $e) {
            return Responder::fail($session, $e->getMessage());
        }
        return Responder::success($session, 'store success');
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
            return Responder::fail($id, 'session id must be a number');
        }
        if (!Session::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the session with the id ' . $id . ' does not exist.');
        }
        $session = Session::where('id', $id)->first();
        return Responder::success($session, 'get session success');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateSessionRequest $request, $id)
    {
        $validated = $request->validated();
        $session = '';
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'session id must be a number');
        }
        if (!Session::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the session with the id ' . $id . ' does not exist.');
        }
        try {
            $session = $this->updateSessionAction->handle($validated, $id);
        } catch (Exception $e) {
            return Responder::fail($session, $e->getMessage());
        }
        return Responder::success($session, 'update success');
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
            return Responder::fail($id, 'session id must be a number');
        }
        if (!Session::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the session with the id ' . $id . ' does not exist.');
        }
        $deleteSession = Session::where('id', $id)->delete();
        return Responder::success($deleteSession, 'delete success');

    }
}
