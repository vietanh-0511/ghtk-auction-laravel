<?php

namespace App\Services\Session;

use App\Models\Auction;
use App\Models\Product;
use App\Models\Session;
use Exception;

class UpdateSessionAction
{
    private $checkPrice;

    public function __construct(
        CheckPrice $checkPrice
    ) {
        $this->checkPrice = $checkPrice;
    }

    public function handle($validated, $id)
    {
        if (!Product::query()->where('id', $validated['product_id'])->exists()) {
            throw new Exception('Product does not exist');
        }
        if (!Auction::query()->where('id', $validated['auction_id'])->exists()) {
            throw new Exception('Auction does not exist');
        }
        $this->checkPrice->handle($validated);
        Session::where('id', $id)->update($validated);
    }
}
