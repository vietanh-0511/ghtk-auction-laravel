<?php

namespace App\Services\Bid;

use App\Enums\AuctionStatusEnum;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Session;
use Carbon\Carbon;
use Exception;

class CreateBidAction
{
    private $bidPriceChecker;

    private $updateWinner;

    public function __construct(
        BidPriceChecker $bidPriceChecker,
        UpdateWinner $updateWinner
    ) {
        $this->bidPriceChecker = $bidPriceChecker;
        $this->updateWinner = $updateWinner;
    }

    public function handle(array $validated, $userId)
    {
        if (!Session::query()->where('id', $validated['session_id'])->exists()) {
            throw new Exception("Phiên không tồn tại");
        }
        $auctionId = Session::query()->where('id', $validated['session_id'])->first('auction_id');
        $auction = Auction::query()->where('id', $auctionId->auction_id)->first();
        if ($auction->status == AuctionStatusEnum::Preview) {
            throw new Exception("Phiên đấu giá chưa mở");
        }
        if ($auction->status == AuctionStatusEnum::End) {
            throw new Exception("Phiên đấu giá đã kết thúc");
        }
        $this->bidPriceChecker->handle($validated);
        $validated['user_id'] = $userId;
        $bid = Bid::create($validated);
        $this->updateWinner->handle($bid);
    }
}
