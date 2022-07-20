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
        $this->calculateStepPrice->handle($request);
        // dd($request['price_step']);
        Session::create($request);
    }
}
