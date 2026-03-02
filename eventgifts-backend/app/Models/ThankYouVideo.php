<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThankYouVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'contribution_id',
        'video_url',
        'watched_at',
    ];

    protected $casts = [
        'watched_at' => 'datetime',
    ];

    public function contribution()
    {
        return $this->belongsTo(Contribution::class);
    }
}
