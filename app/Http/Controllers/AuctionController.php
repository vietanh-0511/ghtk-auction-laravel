<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAutionRequest;
use App\Models\Auction;
use App\Supports\Responder;
use Illuminate\Http\Request;

class AuctionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $auctions = Auction::all();
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
        $auction = Auction::create($request->all());
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
        $auctions = Auction::findOrFail($id);
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
        $auctionUpdated = Auction::where('id', $id)->update($request->all());
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
            'messages'=>'list bids',
            'data'=>$auctions,
            'status'=>true
        ]);
    }
}
