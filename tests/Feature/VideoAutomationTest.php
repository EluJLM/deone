<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VideoAutomationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_save_social_connection(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('social-connections.store'), [
            'platform' => 'facebook',
            'account_label' => 'Mi Fan Page',
            'access_token' => 'token-facebook',
            'is_enabled' => true,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('social_connections', [
            'user_id' => $user->id,
            'platform' => 'facebook',
            'account_label' => 'Mi Fan Page',
            'is_enabled' => true,
        ]);
    }

    public function test_uploaded_video_respects_selected_platform_checkboxes(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $user->socialConnections()->create([
            'platform' => 'facebook',
            'account_label' => 'Fan Page',
            'access_token' => 'token-facebook',
            'is_enabled' => true,
        ]);

        $response = $this->actingAs($user)->post(route('video-publications.store'), [
            'title' => 'Video de prueba',
            'video' => UploadedFile::fake()->create('video.mp4', 2048, 'video/mp4'),
            'publish_to_facebook' => true,
            'publish_to_instagram' => false,
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('video_publications', [
            'user_id' => $user->id,
            'title' => 'Video de prueba',
            'status' => 'published',
            'facebook_status' => 'published',
            'instagram_status' => 'skipped',
            'publish_to_facebook' => true,
            'publish_to_instagram' => false,
        ]);
    }
}
