<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SocialConnectionController;
use App\Http\Controllers\VideoPublicationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    return Inertia::render('Dashboard', [
        'socialConnections' => $user->socialConnections()
            ->get(['platform', 'account_label', 'is_enabled', 'last_connected_at']),
        'videoPublications' => $user->videoPublications()
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'status', 'facebook_status', 'instagram_status', 'created_at']),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/social-settings', function () {
        return Inertia::render('SocialSettings', [
            'socialConnections' => auth()->user()->socialConnections()
                ->get(['platform', 'account_label', 'is_enabled', 'last_connected_at']),
        ]);
    })->name('social-settings.index');

    Route::get('/videos/upload', function () {
        $user = auth()->user();

        return Inertia::render('VideoUpload', [
            'socialConnections' => $user->socialConnections()
                ->get(['platform', 'account_label', 'is_enabled']),
            'videoPublications' => $user->videoPublications()
                ->latest()
                ->limit(10)
                ->get(['id', 'title', 'status', 'facebook_status', 'instagram_status', 'result_message', 'created_at']),
        ]);
    })->name('video-publications.create');

    Route::post('/social-connections', [SocialConnectionController::class, 'store'])->name('social-connections.store');
    Route::get('/social-connections/{platform}/oauth', [SocialConnectionController::class, 'oauthRedirect'])->name('social-connections.oauth');
    Route::get('/social-connections/{platform}/callback', [SocialConnectionController::class, 'oauthCallback'])->name('social-connections.callback');
    Route::post('/video-publications', [VideoPublicationController::class, 'store'])->name('video-publications.store');
});

require __DIR__.'/auth.php';
