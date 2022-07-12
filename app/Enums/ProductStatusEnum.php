<?php

namespace App\Enums;

use BenSampo\Enum\Enum;
use Illuminate\Validation\Rules\Enum as RulesEnum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ProductStatusEnum extends RulesEnum
{
    const Pending =   0;
    const NotAccepted =   1;
    const Accepted = 2;
    const Sold = 3;
    const Expired = 4;
}
