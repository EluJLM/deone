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
            ->get(['id', 'title', 'status', 'facebook_status', 'instagram_status', 'result_message', 'created_at']),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/social-connections', [SocialConnectionController::class, 'store'])->name('social-connections.store');
    Route::post('/video-publications', [VideoPublicationController::class, 'store'])->name('video-publications.store');
});

require __DIR__.'/auth.php';
