<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'guest_id',
        'amount',
        'message_text',
        'video_note_url',
        'status',
        'transaction_reference',
    ];

    public function registryItem()
    {
        return $this->belongsTo(RegistryItem::class, 'item_id');
    }

    public function guest()
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function thankYouVideo()
    {
        return $this->hasOne(ThankYouVideo::class, 'contribution_id');
    }
}
