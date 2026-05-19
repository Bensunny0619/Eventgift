<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Event;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_host_can_update_event_customization()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create([
            'host_id' => $user->id,
            'title' => 'Initial Title'
        ]);

        $response = $this->actingAs($user)->putJson("/api/events/{$event->id}", [
            'theme_color' => 'midnight-blue',
            'welcome_message' => 'Welcome to our special day!'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'theme_color' => 'midnight-blue',
            'welcome_message' => 'Welcome to our special day!'
        ]);
    }
}
