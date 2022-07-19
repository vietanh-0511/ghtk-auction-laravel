<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    public function user()
    {
        $this->belongsTo(User::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    public function session()
    {
        return $this->hasOne(Session::class);
    }
}
