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
            throw new TimeCheckException("this auction has already exists");
        }
        Auction::create($validated);
    }
}
