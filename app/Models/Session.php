<?php

namespace App\Models;

use DateTimeInterface;
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
        'price_step',
        'highest_bid',
        'winner_id',
        'product_id',
        'auction_id',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
      return $date->format('Y-m-d H:i:s');
    }

    public function bids()
    {
        return $this->hasMany(Bid::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
