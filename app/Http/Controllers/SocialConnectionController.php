<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SocialConnectionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'platform' => ['required', 'in:facebook,instagram'],
            'account_label' => ['nullable', 'string', 'max:255'],
            'access_token' => ['required', 'string', 'max:5000'],
            'is_enabled' => ['nullable', 'boolean'],
        ]);

        $request->user()->socialConnections()->updateOrCreate(
            ['platform' => $validated['platform']],
            [
                'account_label' => $validated['account_label'] ?? null,
                'access_token' => $validated['access_token'],
                'is_enabled' => (bool) ($validated['is_enabled'] ?? true),
                'last_connected_at' => now(),
            ]
        );

        return back()->with('success', 'Cuenta conectada correctamente.');
    }
}
