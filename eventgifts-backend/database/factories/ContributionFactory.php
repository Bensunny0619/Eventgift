<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contribution>
 */
class ContributionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_id' => \App\Models\RegistryItem::factory(),
            'guest_id' => \App\Models\User::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 100),
            'message_text' => $this->faker->sentence,
            'status' => 'paid',
            'transaction_reference' => $this->faker->uuid,
        ];
    }
}
