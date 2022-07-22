<?php

namespace App\Services\Session;

class CalculateStepPrice
{
    public function handle($request)
    {
        $priceStep = $request['start_price'] * ($request['price_step'] / 100);
        $request['price_step'] = $priceStep;
        // dd($request['price_step']);
    }
}
