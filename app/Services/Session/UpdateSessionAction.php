<?php

namespace App\Services\Session;

use App\Models\Session;
use Exception;

class UpdateSessionAction
{
    private $checkPrice;
    private $checkProduct;

    public function __construct(
        CheckPrice $checkPrice,
        CheckProrduct $checkProduct
    ) {
        $this->checkPrice = $checkPrice;
        $this->checkProduct = $checkProduct;
    }

    public function handle($validated, $id)
    {
        if (!$this->checkProduct->handle($validated)) {
            throw new Exception('Product does not exist');
        }
        $this->checkPrice->handle($validated);
        Session::where('id', $id)->update($validated);
    }
}
