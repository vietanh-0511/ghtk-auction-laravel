<?php

namespace App\Services\Bid;

use App\Models\Session;

class BidPriceChecker
{
    public function handle($request)
    {
        //get input price
        $price = $request['amount'];

        //get session info
        $sessionInfo = Session::where('id', $request['session_id'])->first();
        $winnerId = $sessionInfo->winner_id;
        $highestBid = $sessionInfo->highest_bid;
        $stepPrice = $sessionInfo->price_step;

        //calculate next bid price
        $nextBib = $highestBid + $stepPrice;

        if ($winnerId == '') {
            if ($price < $sessionInfo->price_step) {
                return false;
            }
            return true;
        }
        if ($winnerId != '') {
            if ($price < $nextBib) {
                return false;
            }
            return true;
        }
    }
}
