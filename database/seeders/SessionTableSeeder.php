<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Session;
use Illuminate\Database\Seeder;

class SessionTableSeeder extends Seeder
{
    public function run()
    {
        for ($i = 0; $i < 5; $i++) {
            for ($j = 0; $j < 5; $j++) {
                $start_price = rand(1000, 5E5);
                Session::create([
                    'start_price' => $start_price,
                    'price_step' => ceil($start_price * 0.05),
                    'product_id' => $i * 5 + $j + 1,
                    'auction_id' => $i + 1
                ]);
            }
        }
    }
}
