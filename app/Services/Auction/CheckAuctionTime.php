<?php

namespace App\Services\Auction;

use App\Models\Auction;
use Carbon\Carbon;
use Exception;

class CheckAuctionTime
{
    public function handle(array $validated)
    {
        $start_time = $validated['start_time'];
        $end_time = $validated['end_time'];
        $current = Carbon::now('Asia/Ho_Chi_Minh');
        if (strtotime($start_time) > strtotime($end_time)) {
            throw new Exception('Auction start time invalid (start time later than end time)');
        }
        if (strtotime($start_time) < strtotime($current)) {
            throw new Exception('Auction start time invalid');
        }
        return Auction::query()
            ->where([
                ['start_time', $start_time],
                ['end_time', $end_time]
            ])->exists();
    }
}
