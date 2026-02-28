<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'platform',
        'account_label',
        'access_token',
        'is_enabled',
        'last_connected_at',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'is_enabled' => 'boolean',
            'last_connected_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
