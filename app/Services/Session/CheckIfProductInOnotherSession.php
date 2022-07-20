<?php

namespace App\Services\Session;

use App\Models\Session;

class CheckIfProductInOnotherSession
{
    public function handle($request)
    {
        $sessionProduct = Session::where('id', '=', $request['product_id'])->get();
        if (count($sessionProduct) >= 1) {
            return false;
        }
        return true;
    }
}
