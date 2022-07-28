<?php

namespace App\Http\Controllers;

use App\Events\bidUpdate;
use Carbon\Carbon;
use App\Exceptions\CreateBidException;
use App\Http\Requests\StoreBidRequest;
use App\Services\Bid\CreateBidAction;
use App\Supports\Responder;
use Illuminate\Http\Request;
use App\Models\Bid;
use Exception;

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
        $limit = $request->limit;
        $bid = Bid::paginate($limit);
        return response()->json([
            'messages'=>'list bids',
            'data'=>$bid,
            'status'=>true
        ]);
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
        $request->validated();

        $userId = $request->user('api')->id;
        try {
            $bid = $this->createBidAction->handle($request->toArray(), $userId);
        } catch (CreateBidException $e) {
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
        try {
            $bid = Bid::findOrFail($id);
        } catch (Exception $e) {
            return Responder::fail($bid, $e->getMessage());
        }
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
        Bid::where('id', $id)->delete();
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

    // public function bidView($id)
    // {
    //     $bidProductInfo = Product::where('products.id', $id)
    //         ->join('auctions', 'auctions.id', '=', 'products.auction_id')
    //         ->first();
    //     return view('user.bid', ['info' => $bidProductInfo]);
    // }
}
