<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Snippet extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'code',
        'language',
        'is_favorite',
    ];
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
