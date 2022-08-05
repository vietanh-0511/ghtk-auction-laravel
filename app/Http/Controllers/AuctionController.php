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
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $auctions = Auction::query()->orderByDesc('id')->get();
        return Responder::success($auctions, 'get auctions success');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
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
     *
     * @return \Illuminate\Http\JsonResponse
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
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
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (!Auction::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the auction with the id ' . $id . ' does not exist.');
        }
        $deleteAuction = Auction::where('id', $id)->delete();
        return Responder::success($deleteAuction, 'delete success');
    }
}
