<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\View\View;

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

    public function oauthRedirect(Request $request, string $platform): RedirectResponse
    {
        abort_unless(in_array($platform, ['facebook', 'instagram'], true), 404);

        $appId = config('services.meta.app_id');

        abort_if(blank($appId), 500, 'Configura META_APP_ID en .env');

        $state = Str::uuid()->toString();
        $request->session()->put("meta_oauth_state_{$platform}", $state);

        $scopes = [
            'facebook' => [
                'pages_show_list',
                'pages_read_engagement',
                'pages_manage_posts',
                'business_management',
            ],
            'instagram' => [
                'instagram_basic',
                'instagram_content_publish',
                'pages_show_list',
                'business_management',
            ],
        ];

        $query = http_build_query([
            'client_id' => $appId,
            'redirect_uri' => route('social-connections.callback', ['platform' => $platform]),
            'response_type' => 'code',
            'scope' => implode(',', $scopes[$platform]),
            'state' => $state,
        ]);

        return redirect()->away("https://www.facebook.com/v20.0/dialog/oauth?{$query}");
    }

    public function oauthCallback(Request $request, string $platform): View
    {
        abort_unless(in_array($platform, ['facebook', 'instagram'], true), 404);

        if ($request->filled('error')) {
            return view('social.oauth-callback', [
                'ok' => false,
                'message' => 'El usuario canceló el inicio de sesión en Meta.',
            ]);
        }

        $expectedState = $request->session()->pull("meta_oauth_state_{$platform}");

        if (! $expectedState || ! hash_equals($expectedState, (string) $request->query('state'))) {
            return view('social.oauth-callback', [
                'ok' => false,
                'message' => 'No se pudo validar el estado OAuth. Intenta nuevamente.',
            ]);
        }

        $response = Http::asForm()->post('https://graph.facebook.com/v20.0/oauth/access_token', [
            'client_id' => config('services.meta.app_id'),
            'client_secret' => config('services.meta.app_secret'),
            'redirect_uri' => route('social-connections.callback', ['platform' => $platform]),
            'code' => (string) $request->query('code'),
        ]);

        if ($response->failed() || blank($response->json('access_token'))) {
            return view('social.oauth-callback', [
                'ok' => false,
                'message' => 'No se pudo obtener el access token desde Meta.',
            ]);
        }

        $accessToken = $response->json('access_token');

        $me = Http::get('https://graph.facebook.com/me', [
            'fields' => 'id,name',
            'access_token' => $accessToken,
        ])->json();

        $request->user()->socialConnections()->updateOrCreate(
            ['platform' => $platform],
            [
                'account_label' => $me['name'] ?? ucfirst($platform),
                'access_token' => $accessToken,
                'is_enabled' => true,
                'last_connected_at' => now(),
            ]
        );

        return view('social.oauth-callback', [
            'ok' => true,
            'message' => ucfirst($platform).' conectado correctamente.',
        ]);
    }
}
