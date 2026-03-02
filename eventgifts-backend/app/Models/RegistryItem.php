<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'title',
        'description',
        'price',
        'amount_raised',
        'is_split_allowed',
        'type',
        'image_url',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class, 'item_id');
    }
}
