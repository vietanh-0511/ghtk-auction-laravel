<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Session extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'start_price',
        'price_step',
        'highest_bid',
        'winner_id',
        'product_id',
        'auction_id',
        'additional_data'
    ];

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

}
