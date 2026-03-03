<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ThankYouVideo>
 */
class ThankYouVideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contribution_id' => \App\Models\Contribution::factory(),
            'video_url' => $this->faker->url,
            'watched_at' => null,
        ];
    }
}
