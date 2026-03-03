<?php

namespace Tests\Feature;

use App\Models\Contribution;
use App\Models\Event;
use App\Models\RegistryItem;
use App\Models\User;
use App\Models\ThankYouVideo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ThankYouVideoTest extends TestCase
{
    use RefreshDatabase;

    public function test_host_can_upload_thank_you_video()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $user->id]);
        $item = RegistryItem::factory()->create(['event_id' => $event->id]);
        $contribution = Contribution::factory()->create(['item_id' => $item->id]);

        $response = $this->actingAs($user)->postJson("/api/contributions/{$contribution->id}/thank-you", [
            'video_url' => 'https://example.com/video.mp4'
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['video_url' => 'https://example.com/video.mp4']);
        
        $this->assertDatabaseHas('thank_you_videos', [
            'contribution_id' => $contribution->id,
            'video_url' => 'https://example.com/video.mp4'
        ]);
    }

    public function test_non_host_cannot_upload_thank_you_video()
    {
        $host = User::factory()->create();
        $stranger = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $host->id]);
        $item = RegistryItem::factory()->create(['event_id' => $event->id]);
        $contribution = Contribution::factory()->create(['item_id' => $item->id]);

        $response = $this->actingAs($stranger)->postJson("/api/contributions/{$contribution->id}/thank-you", [
            'video_url' => 'https://example.com/video.mp4'
        ]);

        $response->assertStatus(403);
    }

    public function test_guest_can_view_thank_you_video_and_marks_as_watched()
    {
        $contribution = Contribution::factory()->create();
        $video = ThankYouVideo::factory()->create([
            'contribution_id' => $contribution->id,
            'video_url' => 'https://example.com/thanks.mp4',
            'watched_at' => null
        ]);

        $response = $this->getJson("/api/contributions/{$contribution->id}/thank-you");

        $response->assertStatus(200)
                 ->assertJsonFragment(['video_url' => 'https://example.com/thanks.mp4']);
        
        $this->assertNotNull($video->refresh()->watched_at);
    }
}
