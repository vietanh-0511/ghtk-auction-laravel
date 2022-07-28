<?php

namespace App\Services\Auction;

use App\Exceptions\TimeCheckException;
use App\Models\Auction;
use App\Supports\Responder;
use Exception;

class UpdateAuctionAction
{
    private $checkAuctionTime;

    public function __construct(CheckAuctionTime $checkAuctionTime)
    {
        $this->checkAuctionTime = $checkAuctionTime;
    }

    public function handle(array $validated, int $id)
    {
        if (!Auction::query()->where('id', $id)->exists()) {
            throw new Exception('the auction with the id ' . $id . ' does not exist.');
        }
        
        if ($this->checkAuctionTime->handle($validated)) {
            throw new TimeCheckException("this auction has already exists");
        }

        Auction::where('id', $id)->update($validated);
    }
}
