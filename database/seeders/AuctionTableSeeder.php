<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\Session;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AuctionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 5; $i++) {
            $start = Carbon::now()->subMinutes(rand(1, 55));
            Auction::create([
                'title' => 'Auction' . $i,
                'start_time' => $start,
                'end_time' => $start->copy()->addDays(rand(1, 10))
            ]);
        }
    }
}
