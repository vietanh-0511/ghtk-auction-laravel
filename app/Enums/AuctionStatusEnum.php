<?php

namespace App\Enums;

use BenSampo\Enum\Enum;
use Illuminate\Validation\Rules\Enum as RulesEnum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class AuctionStatusEnum extends RulesEnum
{
    const Preview =   0;
    const Publish =   1;
    const End = 2;
}
