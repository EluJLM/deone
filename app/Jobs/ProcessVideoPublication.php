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

        $facebookRequested = (bool) $publication->publish_to_facebook;
        $instagramRequested = (bool) $publication->publish_to_instagram;

        $facebookReady = $facebookRequested
            && $connections->has('facebook')
            && ! empty($connections['facebook']->access_token);

        $instagramReady = $instagramRequested
            && $connections->has('instagram')
            && ! empty($connections['instagram']->access_token);

        $publication->facebook_status = $facebookRequested
            ? ($facebookReady ? 'published' : 'not_configured')
            : 'skipped';

        $publication->instagram_status = $instagramRequested
            ? ($instagramReady ? 'published' : 'not_configured')
            : 'skipped';

        $wasPublished = $facebookReady || $instagramReady;

        $publication->status = $wasPublished ? 'published' : 'failed';
        $publication->result_message = $wasPublished
            ? 'Video enviado automáticamente a las cuentas seleccionadas.'
            : 'No se pudo publicar: revisa redes seleccionadas y credenciales.';
        $publication->published_at = $wasPublished ? now() : null;
        $publication->save();
    }
}
