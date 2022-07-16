<?php

namespace App\Services\Bid;

use App\Models\Session;

class UpdateWinner
{
    public function handle($bid)
    {
        // dd($bid['user_id'], $bid['price']);
        $sessionId = $bid['session_id'];
        $highestBid = $bid['amount'];
        $winnerId = $bid['user_id'];
        Session::where('id', $sessionId)->update([
            'highest_bid' => $highestBid,
            'winner_id' => $winnerId
        ]);
    }
}
