<?php

namespace App\Services\Bid;

use App\Exceptions\BidPriceException;
use App\Models\Bid;
use App\Models\Session;
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
            throw new Exception("Session does not exist");
        }
        $this->bidPriceChecker->handle($validated);
        $validated['user_id'] = $userId;
        $bid = Bid::create($validated);
        $this->updateWinner->handle($bid);
    }
}
