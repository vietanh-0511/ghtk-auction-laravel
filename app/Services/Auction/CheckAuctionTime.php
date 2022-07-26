<?php

namespace App\Services\Auction;

use App\Models\Auction;
use App\Supports\Responder;

class CheckAuctionTime
{
    public function handle($request)
    {
        $start_time = $request['start_time'];
        $end_time = $request['end_time'];
        $time = Auction::where([
            ['start_time', $start_time],
            ['end_time', $end_time]
        ])->get();
        if (count($time) >= 1) {
            return false;
        }
        return true;
    }
}
