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
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $bid = Bid::query()->orderByDesc('id')->get();
        return Responder::success($bid, 'Thành công');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreBidRequest $request)
    {
        $validated = $request->validated();
        $userId = $request->user('api')->id;
        $bid = '';
        try {
            $this->createBidAction->handle($validated, $userId);
        } catch (Exception $e) {
            return Responder::fail(null, $e->getMessage());
        }

        return Responder::success($bid, 'Đấu giá thành công');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $bid = '';
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là số');
        }
        if (!Bid::query()->where('id', $id)->exists()) {
            return Responder::fail($bid, 'Bid không tồn tại');
        }
        $bid = Bid::where('id', $id)->first();
        return Responder::success($bid, 'Lấy thành công');
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là số');
        }
        if (!Bid::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Bid không tồn tại');
        }
        $deleteBid = Bid::where('id', $id)->delete();
        return Responder::success($deleteBid, 'Xóa thành công');
    }

    public function updateBidMessage()
    {
        $price = request('price');
        $name = request('name');
        $auction = request('auction');
        $session = request('session');
        $time = Carbon::now('Asia/Ho_Chi_Minh');
        event(new bidUpdate($price, $name, $auction, $session, $time));
    }
}
