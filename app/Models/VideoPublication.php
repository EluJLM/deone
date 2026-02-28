<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoPublication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'video_path',
        'status',
        'facebook_status',
        'instagram_status',
        'publish_to_facebook',
        'publish_to_instagram',
        'result_message',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'publish_to_facebook' => 'boolean',
            'publish_to_instagram' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
