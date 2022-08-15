<?php

namespace App\Http\Controllers;

use App\Enums\AuctionStatusEnum;
use App\Http\Requests\StoreAutionRequest;
use App\Models\Asset;
use App\Models\Auction;
use App\Models\Product;
use App\Models\Session;
use App\Services\Auction\CheckAuctionStatus;
use App\Services\Auction\CreateAuctionAction;
use App\Services\Auction\UpdateAuctionAction;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;

class AuctionController extends Controller
{
    private $createAuctionAction;
    private $updateAuctionAction;
    private $checkAuctionStatus;

    public function __construct(
        CreateAuctionAction $createAuctionAction,
        UpdateAuctionAction $updateAuctionAction,
        CheckAuctionStatus $checkAuctionStatus
    ) {
        $this->createAuctionAction = $createAuctionAction;
        $this->updateAuctionAction = $updateAuctionAction;
        $this->checkAuctionStatus = $checkAuctionStatus;
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
        foreach ($auctions as $auction) {
            $auction->status = AuctionStatusEnum::getKey($auction->status);
            $this->checkAuctionStatus->handle($auction);
        }
        return Responder::success($auctions, 'Danh sách phiên đấu giá');
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
        return Responder::success($auction, 'Lưu thành công');
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
            return Responder::fail($id, 'id phiên đấu giá phải là 1 số');
        }
        if (!Auction::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Phiên đấu giá này không tồn tại');
        }
        $auction = Auction::query()->where('id', $id)->first();
        $auction->status = AuctionStatusEnum::getKey($auction->status);
        $session = Session::with('product')->where('auction_id',$id)->get();
        $this->checkAuctionStatus->handle($auction);
        foreach ($session as $each) {
            $each->product = Product::query()->where('id', $each->product_id)->first();
            $each->assets = Asset::query()->where('assetable', $each->product_id)->get();
        }
        return Responder::success(['auction' => $auction, 'session' => $session], 'Lấy phiên đấu giá thành công');
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
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phiên đấu giá phải là 1 số');
        }
        try {
            $auction = $this->updateAuctionAction->handle($validated, $id);
        } catch (Exception $e) {
            return Responder::fail($auction, $e->getMessage());
        }
        return Responder::success($auction, 'Sửa thành công');
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
            return Responder::fail($id, 'id phiên đấu giá phải là 1 số');
        }
        if (!Auction::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Phiên đấu giá không tồn tại');
        }
        $deleteAuction = Auction::query()->where('id', $id)->delete();
        Session::query()->where('auction_id', $id)->delete();
        return Responder::success($deleteAuction, 'Xóa thành công');
    }
}
