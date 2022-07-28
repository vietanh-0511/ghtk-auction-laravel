<?php

namespace App\Services\Auction;

use App\Models\Auction;
use App\Supports\Responder;

class CheckAuctionTime
{
    public function handle(array $validated)
    {
        $start_time = $validated['start_time'];
        $end_time = $validated['end_time'];
        return Auction::query()
            ->where([
            ['start_time', $start_time],
            ['end_time', $end_time]
            ])->exists();
    }
}
