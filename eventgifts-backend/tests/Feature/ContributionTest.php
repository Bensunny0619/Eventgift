<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\RegistryItem;

class ContributionTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_contribute_to_item()
    {
        $item = RegistryItem::factory()->create(['amount_raised' => 0]);

        $contributionData = [
            'amount' => 50.00,
            'message_text' => 'Happy Birthday!',
            'transaction_reference' => 'TEST_REF_123'
        ];

        $response = $this->postJson("/api/registry-items/{$item->id}/contribute", $contributionData);

        $response->assertStatus(201)
                 ->assertJsonFragment(['amount' => 50.00]);

        $this->assertDatabaseHas('contributions', [
            'item_id' => $item->id,
            'amount' => 50.00,
            'status' => 'pledged',
            'transaction_reference' => 'TEST_REF_123'
        ]);

        // Verify RegistryItem amount_raised was NOT incremented yet (pledge flow)
        $this->assertEquals(0, $item->refresh()->amount_raised);
    }

    public function test_authenticated_user_can_contribute_to_item_as_pledge()
    {
        $user = User::factory()->create();
        $item = RegistryItem::factory()->create(['amount_raised' => 0]);

        $contributionData = [
            'amount' => 100.00,
            'transaction_reference' => 'AUTH_REF_456'
        ];

        $response = $this->actingAs($user)->postJson("/api/registry-items/{$item->id}/contribute", $contributionData);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('contributions', [
            'item_id' => $item->id,
            'guest_id' => $user->id,
            'amount' => 100.00,
            'status' => 'pledged'
        ]);
    }
}
