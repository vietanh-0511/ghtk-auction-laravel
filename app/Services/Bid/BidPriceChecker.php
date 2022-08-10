<?php

namespace App\Services\Bid;

use App\Models\Session;
use Exception;

class BidPriceChecker
{
    public function handle($validated)
    {
        //get session info
        $sessionInfo = Session::where('id', $validated['session_id'])->first();
        $winnerId = $sessionInfo->winner_id;
        $highestBid = $sessionInfo->highest_bid;
        $priceStep = $sessionInfo->price_step;

        //calculate next bid price
        $nextBid = $highestBid + $priceStep;

        if ($winnerId == '') {
            if ($validated['amount'] < $sessionInfo->start_price) {
                throw new Exception("Bid amount cannot less than start price");
            }
        }
        if ($winnerId != '') {
            if ($validated['amount'] < $nextBid) {
                throw new Exception("Bid amount cannot less than " . $nextBid);
            }
        }
    }
}
