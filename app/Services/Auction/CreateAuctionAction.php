<?php

namespace App\Services\Auction;

use App\Exceptions\TimeCheckException;
use App\Models\Auction;

class CreateAuctionAction
{
    private $checkAuctionTime;

    public function __construct(CheckAuctionTime $checkAuctionTime)
    {
        $this->checkAuctionTime = $checkAuctionTime;
    }

    public function handle(array $validated)
    {
        if ($this->checkAuctionTime->handle($validated)) {
            throw new TimeCheckException("Phiên đấu giá đã tổn tại");
        }
        Auction::create($validated);
    }
}
