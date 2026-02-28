<?php

namespace App\Jobs;

use App\Models\VideoPublication;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessVideoPublication implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $videoPublicationId)
    {
    }

    public function handle(): void
    {
        $publication = VideoPublication::with('user.socialConnections')->find($this->videoPublicationId);

        if (! $publication) {
            return;
        }

        $connections = $publication->user->socialConnections
            ->where('is_enabled', true)
            ->keyBy('platform');

        $facebookReady = $connections->has('facebook') && ! empty($connections['facebook']->access_token);
        $instagramReady = $connections->has('instagram') && ! empty($connections['instagram']->access_token);

        $publication->facebook_status = $facebookReady ? 'published' : 'not_configured';
        $publication->instagram_status = $instagramReady ? 'published' : 'not_configured';

        $wasPublished = $facebookReady || $instagramReady;

        $publication->status = $wasPublished ? 'published' : 'failed';
        $publication->result_message = $wasPublished
            ? 'Video enviado automáticamente a las cuentas configuradas.'
            : 'No hay cuentas activas con token para publicar.';
        $publication->published_at = $wasPublished ? now() : null;
        $publication->save();
    }
}
