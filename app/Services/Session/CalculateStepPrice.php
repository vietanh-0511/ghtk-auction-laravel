<?php

namespace App\Services\Session;

class CalculateStepPrice
{
    public function handle($request)
    {
        $stepPrice = $request['start_price'] * ($request['price_step'] / 100);
        $request['price_step'] = $stepPrice;
    }
}
