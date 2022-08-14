<?php

namespace App\Services\Auction;

use App\Enums\AuctionStatusEnum;

class CheckAuctionStatus
{
    public function handle($auction)
    {
        if ($auction->status == AuctionStatusEnum::getKey(AuctionStatusEnum::Preview)) {
            $auction->message = 'Phiên đấu giá chưa bắt đầu';
        }
        if ($auction->status == AuctionStatusEnum::getKey(AuctionStatusEnum::Publish)) {
            $auction->message = 'Phiên đấu giá đang mở';
        }
        if ($auction->status == AuctionStatusEnum::getKey(AuctionStatusEnum::End)) {
            $auction->message = 'Phiên đấu giá đã kết thúc';
        }
        if ($auction->status == '') {
            $auction->message = 'Trạng thái sai';
        }
    }
}
