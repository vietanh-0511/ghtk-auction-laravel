<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Session extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'start_price',
        'step_price',
        'highest_bid',
        'winner_id',
        'product_id',
        'auction_id'
    ];

    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    public function product(): belongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class);
    }

}
