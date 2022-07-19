<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Auction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'status',
        'start_time',
        'end_time',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }
}
