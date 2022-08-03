<?php

namespace App\Services\Session;

use Exception;

class CheckPrice
{
    public function handle($validated)
    {
        $priceStep = $validated['price_step'];
        $startPrice = $validated['start_price'];
        $maxStep = $startPrice * (50 / 100);
        $minStep = $startPrice * (5 / 100);

        if ($priceStep > $maxStep) {
            throw new Exception('Price step cannot be greater than 50% of start price');
        }

        if ($priceStep < $minStep) {
            throw new Exception('Price step cannot be less than 5% of start price');
        }

        if ($priceStep % 1000 != 0 || $startPrice % 1000 != 0) {
            throw new Exception('Price must be multiples of 1000');
        }
    }
}
