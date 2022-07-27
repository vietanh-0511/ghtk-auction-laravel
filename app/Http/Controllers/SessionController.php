<?php

namespace App\Http\Controllers;

use App\Exceptions\CreateSessionException;
use App\Exceptions\UpdateSessionException;
use App\Http\Requests\StoreSessionRequest;
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
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->limit;
        $sessions = Session::paginate($limit);
        return Responder::success($sessions, 'get sessions success');
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
    public function store(StoreSessionRequest $request)
    {
        $request->validated();
        try {
            $session = $this->createSessionAction->handle($request->toArray());
        } catch (CreateSessionException $e) {
            return Responder::fail($session, $e->getMessage());
        }
        return Responder::success($session, 'store success');
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
            $session = Session::findOrFail($id);
        } catch (Exception $e) {
            return Responder::fail($session, $e->getMessage());
        }
        return Responder::success($session, 'get session success');
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
    public function update(StoreSessionRequest $request, $id)
    {
        $request->validated();
        try {
            $session = $this->updateSessionAction->handle($request->toArray(), $id);
        } catch (UpdateSessionException $e) {
            return Responder::fail($session, $e->getMessage());
        }
        return Responder::success($session, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Session::where('id', $id)->delete();
    }
}
