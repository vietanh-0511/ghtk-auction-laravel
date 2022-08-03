<?php

namespace App\Services\Auction;

use App\Models\Auction;
use Exception;

class UpdateAuctionAction
{
    private $checkAuctionTime;

    public function __construct(CheckAuctionTime $checkAuctionTime)
    {
        $this->checkAuctionTime = $checkAuctionTime;
    }

    public function handle(array $validated, $id)
    {
        if (!Auction::query()->where('id', $id)->exists()) {
            throw new Exception("the auction with id " . $id . " does not exist");
        }
        if ($this->checkAuctionTime->handle($validated)) {
            throw new Exception("this auction has already exists");
        }

        Auction::where('id', $id)->update($validated);
    }
}
