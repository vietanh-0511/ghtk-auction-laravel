<?php

namespace App\Services\Bid;

use App\Exceptions\BidPriceException;
use App\Models\Bid;
use App\Supports\Responder;

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

    public function handle($request, $userId)
    {
        // if (!$this->bidPriceChecker->handle($request)) {
        //     throw new BidPriceException('Price invalid');
        // }

        $request['user_id'] = $userId;

        $bid = Bid::create($request);

        $this->updateWinner->handle($bid);
    }
}
