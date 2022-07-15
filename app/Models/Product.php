<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'desirable_price',
        'title_image',
        'description',
        'status',
        'user_id',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function session(): HasOne
    {
        return $this->hasOne(Session::class);
    }

}
