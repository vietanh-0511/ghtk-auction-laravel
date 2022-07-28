<?php

namespace App\Services\Session;

class CalculateStepPrice
{
    /**
     * @param array $request
     * @return int
     */
    public function handle(array $validated): int
    {
        $priceStep = $validated['start_price'] * ($validated['price_step'] / 100);
        return $priceStep;
    }
}
