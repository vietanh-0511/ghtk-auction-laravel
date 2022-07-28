<?php

namespace App\Services\Auction;

use App\Exceptions\TimeCheckException;
use App\Models\Auction;
use App\Supports\Responder;

class UpdateAuctionAction
{
    private $checkAuctionTime;

    public function __construct(CheckAuctionTime $checkAuctionTime)
    {
        $this->checkAuctionTime = $checkAuctionTime;
    }

    public function handle(array $validated, int $id)
    {
        if ($this->checkAuctionTime->handle($validated)) {
            throw new TimeCheckException("this auction has already exists");
        }

        Auction::where('id', $id)->update($validated);
    }
}
