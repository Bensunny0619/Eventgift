<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\Guest;

class GuestTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_fetch_guest_details()
    {
        $guest = Guest::factory()->create();

        $response = $this->getJson("/api/guests/{$guest->id}/public");

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => $guest->name])
                 ->assertJsonStructure([
                     'id',
                     'name',
                     'email',
                     'status',
                     'event' => [
                         'id',
                         'title',
                         'host' => [
                             'id',
                             'name'
                         ]
                     ]
                 ]);
     }

    public function test_guest_can_rsvp_by_id()
    {
        $guest = Guest::factory()->create(['status' => 'Pending']);

        $response = $this->postJson("/api/guests/{$guest->id}/rsvp", [
            'status' => 'Confirmed'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'Confirmed']);

        $this->assertEquals('Confirmed', $guest->refresh()->status);
    }

    public function test_visitor_can_submit_rsvp_creating_guest()
    {
        $event = Event::factory()->create();

        $response = $this->postJson("/api/events/{$event->id}/rsvp", [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'status' => 'Confirmed'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'Confirmed', 'name' => 'John Doe', 'email' => 'john@example.com']);

        $this->assertDatabaseHas('guests', [
            'event_id' => $event->id,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'status' => 'Confirmed'
        ]);
    }

    public function test_visitor_can_submit_rsvp_updating_existing_guest()
    {
        $event = Event::factory()->create();
        $guest = Guest::factory()->create([
            'event_id' => $event->id,
            'email' => 'john@example.com',
            'status' => 'Pending'
        ]);

        $response = $this->postJson("/api/events/{$event->id}/rsvp", [
            'name' => 'John A. Doe',
            'email' => 'john@example.com',
            'status' => 'Declined'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'Declined', 'name' => 'John A. Doe']);

        $this->assertEquals('Declined', $guest->refresh()->status);
        $this->assertEquals('John A. Doe', $guest->name);
    }
}
