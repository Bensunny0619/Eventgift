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
        $item = RegistryItem::factory()->create(['amount_raised' => 0, 'price' => 500]);

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
            'status' => 'paid',
            'transaction_reference' => 'TEST_REF_123'
        ]);

        // In local/testing env, amount_raised is incremented immediately
        $this->assertEquals(50.00, $item->refresh()->amount_raised);
    }

    public function test_authenticated_user_can_contribute_to_item_as_pledge()
    {
        $user = User::factory()->create();
        $item = RegistryItem::factory()->create(['amount_raised' => 0, 'price' => 500]);

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
            'status' => 'paid'
        ]);
    }

    public function test_overfunding_is_prevented()
    {
        $item = RegistryItem::factory()->create([
            'price' => 100.00,
            'amount_raised' => 80.00,
            'is_split_allowed' => true
        ]);

        $response = $this->postJson("/api/registry-items/{$item->id}/contribute", [
            'amount' => 30.00 // Over limit (remaining is 20)
        ]);

        $response->assertStatus(422)
                 ->assertJsonFragment(['message' => 'Your contribution exceeds the remaining amount required for this item.']);
    }

    public function test_partial_funding_rejected_when_split_payments_disabled()
    {
        $item = RegistryItem::factory()->create([
            'price' => 100.00,
            'amount_raised' => 0.00,
            'is_split_allowed' => false
        ]);

        $response = $this->postJson("/api/registry-items/{$item->id}/contribute", [
            'amount' => 50.00 // Partial payment rejected because split payments are disabled
        ]);

        $response->assertStatus(422)
                 ->assertJsonFragment(['message' => 'This item does not allow split payments. You must contribute the full price.']);

        // A full price contribution should succeed
        $responseSuccess = $this->postJson("/api/registry-items/{$item->id}/contribute", [
            'amount' => 100.00
        ]);

        $responseSuccess->assertStatus(201);
    }
}
