<?php

namespace App\Services\Auction;

class CheckAuctionStatus
{
    public function handle($auction)
    {
        if ($auction->status == 'Preview') {
            $auction->message = 'Phiên đấu giá chưa bắt đầu';
        }
        if ($auction->status == 'Publish') {
            $auction->message = 'Phiên đấu giá đang mở';
        }
        if ($auction->status == 'End') {
            $auction->message = 'Phiên đấu giá đã kết thúc';
        }
        if ($auction->status == '') {
            $auction->message = 'Trạng thái sai';
        }
    }
}
