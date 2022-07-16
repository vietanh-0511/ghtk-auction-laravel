<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'file_name',
        'mime_type',
        'assetable',
        'assetable_type'
    ];

    public function product()
    {
        $this->belongsTo(Product::class);
    }
}
