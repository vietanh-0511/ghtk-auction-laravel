<?php

namespace App\Services\Session;

use App\Models\Product;
use Exception;

class CheckProrduct
{
    public function handle($validated)
    {
        return Product::query()->where('id', $validated['product_id'])->exists();
    }
}
