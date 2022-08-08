<?php

namespace App\Http\Controllers;

use App\Events\bidUpdate;
use Carbon\Carbon;
use App\Http\Requests\StoreBidRequest;
use App\Services\Bid\CreateBidAction;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;
use App\Models\Bid;

class BidController extends Controller
{
    private $createBidAction;

    public function __construct(CreateBidAction $createBidAction)
    {
        $this->createBidAction = $createBidAction;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $bid = Bid::query()->orderByDesc('id')->get();
        return Responder::success($bid, 'get bids success');
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
    public function store(StoreBidRequest $request)
    {
        $validated = $request->validated();
        $userId = $request->user('api')->id;
        $bid = '';
        try {
            $bid = $this->createBidAction->handle($validated, $userId);
        } catch (Exception $e) {
            return Responder::fail($bid, $e->getMessage());
        }
        
        return Responder::success($bid, 'success bid');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $bid = '';
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id must be a number');
        }
        if (!Bid::query()->where('id', $id)->exists()) {
            return Responder::fail($bid, 'the bid with the id ' . $id . ' does not exist.');
        }
        $bid = Bid::where('id', $id)->first();
        return Responder::success($bid, 'get bid success');
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id must be a number');
        }
        if (!Bid::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the bid with the id ' . $id . ' does not exist.');
        }
        $deleteBid = Bid::where('id', $id)->delete();
        return Responder::success($deleteBid, 'delete success');
    }
    
    public function updateBidMessage()
    {
        $price = request()->price;
        $name = request()->name;
        $auction = request()->auction;
        $session = request()->session;
        $time = Carbon::now('Asia/Ho_Chi_Minh');
        event(new bidUpdate($price, $name, $auction, $session, $time));
    }
}
