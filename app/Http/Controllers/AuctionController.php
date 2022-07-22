<?php

namespace App\Http\Controllers;

use App\Exceptions\CreateAuctionException;
use App\Exceptions\UpdateAuctionException;
use App\Http\Requests\StoreAutionRequest;
use App\Models\Auction;
use App\Services\Auction\CreateAuctionAction;
use App\Services\Auction\UpdateAuctionAction;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;

class AuctionController extends Controller
{
    private $createAuctionAction;
    private $updateAuctionAction;

    public function __construct(
        CreateAuctionAction $createAuctionAction,
        UpdateAuctionAction $updateAuctionAction
    ) {
        $this->createAuctionAction = $createAuctionAction;
        $this->updateAuctionAction = $updateAuctionAction;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit  = $request->limit;
        $auctions = Auction::paginate($limit);
        return Responder::success($auctions, 'get auctions success');
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
    public function store(StoreAutionRequest $request)
    {
        $request->validated();
        try {
            $auction = $this->createAuctionAction->handle($request->toArray());
        } catch (CreateAuctionException $e) {
            return $e->getMessage();
        }
        return Responder::success($auction, 'store success');
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
            $auctions = Auction::findOrFail($id);
        } catch (Exception $e) {
            return $e->getMessage();
        }
        return Responder::success($auctions, 'get auctions success');
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
    public function update(StoreAutionRequest $request, $id)
    {
        $request->validated();
        try {
            $auctionUpdated = $this->updateAuctionAction->handle($request->toArray(), $id);
        } catch (UpdateAuctionException $e) {
            return $e->getMessage();
        }
        return Responder::success($auctionUpdated, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Auction::where('id', $id)->delete();
    }

    public function auctionListView() // = index
    {
        $auctions = Auction::all();
        return response()->json([
            'messages' => 'list bids',
            'data' => $auctions,
            'status' => true
        ]);
    }

    
}
