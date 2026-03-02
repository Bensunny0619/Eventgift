<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'date',
        'location',
        'location_coords',
        'template_id',
        'status',
        'cover_image_url',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function registryItems()
    {
        return $this->hasMany(RegistryItem::class);
    }
}
