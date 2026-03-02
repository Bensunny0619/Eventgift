<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Event;
use App\Models\RegistryItem;

class RegistryItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_host_can_list_registry_items()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $user->id]);
        RegistryItem::factory()->count(3)->create(['event_id' => $event->id]);

        $response = $this->actingAs($user)->getJson("/api/events/{$event->id}/items");

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_host_can_add_registry_item()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $user->id]);

        $itemData = [
            'title' => 'New Toaster',
            'price' => 50.00,
            'type' => 'fixed',
            'is_split_allowed' => true
        ];

        $response = $this->actingAs($user)->postJson("/api/events/{$event->id}/items", $itemData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'New Toaster']);
        
        $this->assertDatabaseHas('registry_items', ['title' => 'New Toaster', 'event_id' => $event->id]);
    }

    public function test_another_user_cannot_add_item_to_others_event()
    {
        $host = User::factory()->create();
        $stranger = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $host->id]);

        $response = $this->actingAs($stranger)->postJson("/api/events/{$event->id}/items", [
            'title' => 'Evil Item'
        ]);

        $response->assertStatus(403);
    }

    public function test_host_can_update_their_item()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $user->id]);
        $item = RegistryItem::factory()->create(['event_id' => $event->id]);

        $response = $this->actingAs($user)->putJson("/api/registry-items/{$item->id}", [
            'title' => 'Updated Title'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'Updated Title']);
    }

    public function test_host_can_delete_their_item()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create(['host_id' => $user->id]);
        $item = RegistryItem::factory()->create(['event_id' => $event->id]);

        $response = $this->actingAs($user)->deleteJson("/api/registry-items/{$item->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('registry_items', ['id' => $item->id]);
    }
}
