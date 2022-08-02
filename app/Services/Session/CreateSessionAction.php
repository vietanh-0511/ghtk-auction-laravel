<?php

namespace App\Services\Session;

use App\Models\Session;
use Exception;

class CreateSessionAction
{
    private $checkPrice;
    private $checkProduct;

    public function __construct(
        CheckPrice $checkPrice,
        CheckProrduct $checkProrduct
    ) {
        $this->checkPrice = $checkPrice;
        $this->checkProduct = $checkProrduct;
    }

    public function handle(array $validated)
    {
        if (!$this->checkProduct->handle($validated)) {
            throw new Exception('Product does not exist');
        }
        $this->checkPrice->handle($validated);
        Session::create($validated);
    }
}
