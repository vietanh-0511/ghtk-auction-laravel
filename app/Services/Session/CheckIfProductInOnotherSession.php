<?php

namespace App\Services\Session;

use App\Models\Session;

class CheckIfProductInOnotherSession
{
    public function handle(array $validated): bool
    {
        return Session::where('product_id', '=', $validated['product_id'])->exists();
    }
}
