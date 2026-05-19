<?php

namespace Tests\Feature;

use App\Models\Contribution;
use App\Models\RegistryItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_contribution_auto_verifies_in_local_environment()
    {
        $item = RegistryItem::factory()->create(['amount_raised' => 0]);

        $response = $this->postJson("/api/registry-items/{$item->id}/contribute", [
            'amount' => 100,
            'transaction_reference' => 'TEST_SUCCESS_REF_1'
        ]);

        $response->assertStatus(201);
        $contribution = Contribution::first();

        // In local/testing env, contributions are auto-verified
        $this->assertEquals('paid', $contribution->status);
        $this->assertEquals(100, $item->refresh()->amount_raised);
    }

    public function test_successful_verification_updates_status_and_increments_balance()
    {
        $item = RegistryItem::factory()->create(['amount_raised' => 0]);
        $contribution = Contribution::factory()->create([
            'item_id' => $item->id,
            'amount' => 100,
            'status' => 'pledged',
            'transaction_reference' => 'TEST_SUCCESS_REF_2'
        ]);

        $response = $this->postJson("/api/contributions/{$contribution->id}/verify", [
            'gateway' => 'paystack'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'paid']);

        $this->assertEquals(100, $item->refresh()->amount_raised);
    }

    public function test_failed_verification_does_not_update_status_or_balance()
    {
        $item = RegistryItem::factory()->create(['amount_raised' => 0]);
        $contribution = Contribution::factory()->create([
            'item_id' => $item->id,
            'amount' => 100,
            'status' => 'pledged',
            'transaction_reference' => 'TEST_FAIL_REF_3'
        ]);

        $response = $this->postJson("/api/contributions/{$contribution->id}/verify", [
            'gateway' => 'paystack'
        ]);

        $response->assertStatus(400);
        $this->assertEquals('pledged', $contribution->refresh()->status);
        $this->assertEquals(0, $item->refresh()->amount_raised);
    }
}
