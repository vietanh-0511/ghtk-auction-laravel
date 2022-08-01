<?php

namespace App\Http\Controllers;

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
        $limit = $request->input('limit', 10);
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
        $validated = $request->validated();
        $auction = '';
        try {
            $auction = $this->createAuctionAction->handle($validated);
        } catch (Exception $e) {
            return Responder::fail($auction, $e->getMessage());
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
        if (!Auction::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the auction with the id ' . $id . ' does not exist.');
        }
        $auction = Auction::where('id', $id)->first();
        return Responder::success($auction, 'get auction success');
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
        $validated = $request->validated();
        $auction = '';
        try {
            $auction = $this->updateAuctionAction->handle($validated, $id);
        } catch (Exception $e) {
            return Responder::fail($auction, $e->getMessage());
        }
        return Responder::success($auction, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!Auction::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the auction with the id ' . $id . ' does not exist.');
        }
        $deleteAuction = Auction::where('id', $id)->delete();
        return Responder::success($deleteAuction, 'delete success');
    }

    public function auctionListView(Request $request) // = index
    {
        $limit = $request->input('limit', 10);
        $auctions = Auction::paginate($limit);
        return Responder::success($auctions, 'list auctions');
    }
}
