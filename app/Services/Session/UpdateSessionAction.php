<?php

namespace App\Services\Session;

use App\Exceptions\SessionProductException;
use App\Models\Session;

class UpdateSessionAction
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

    public function handle(array $validated, $id)
    {
        if ($this->checkIfProductInOnotherSession->handle($validated)) {
            throw new SessionProductException('This product is in another session!');
        }
        $validated['price_step'] = $this->calculateStepPrice->handle($validated);
        // dd($validated);
        Session::where('id', $id)->update($validated);
    }
}
