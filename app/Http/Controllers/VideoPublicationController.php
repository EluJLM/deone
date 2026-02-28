<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessVideoPublication;
use App\Models\VideoPublication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VideoPublicationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'video' => ['required', 'file', 'mimes:mp4,mov,avi,mkv', 'max:102400'],
        ]);

        $videoPath = $request->file('video')->store('videos', 'public');

        $publication = VideoPublication::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'video_path' => $videoPath,
            'status' => 'queued',
            'facebook_status' => 'pending',
            'instagram_status' => 'pending',
        ]);

        ProcessVideoPublication::dispatchSync($publication->id);

        return back()->with('success', 'Video subido y procesado para publicación automática.');
    }
}
