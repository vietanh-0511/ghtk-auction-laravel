<?php

namespace App\Services\Session;

use App\Exceptions\SessionProductException;
use App\Models\Session;

class CreateSessionAction
{
    private $checkIfProductInOnotherSession;
    private $calculateStepPrice;

    public function __construct(
        CheckIfProductInOnotherSession $checkIfProductInOnotherSession,
        CalculateStepPrice $calculateStepPrice
    ) {
        $this->checkIfProductInOnotherSession = $checkIfProductInOnotherSession;
        $this->calculateStepPrice = $calculateStepPrice;
    }

    public function handle($request)
    {
        if (!$this->checkIfProductInOnotherSession->handle($request)) {
            throw new SessionProductException('This product is in another session!');
        }
        // $this->calculateStepPrice->handle($request);
        $priceStep = $request['start_price'] * ($request['price_step'] / 100);
        $request['price_step'] = (int)$priceStep;
        // dd($request);

        Session::create($request);
    }
}
