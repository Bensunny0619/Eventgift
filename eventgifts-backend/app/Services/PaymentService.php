<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Verify a transaction reference with the specified gateway.
     * Note: This currently implements a mock verification for development.
     */
    public function verifyReference(string $reference, string $gateway = 'paystack'): bool
    {
        // For development/mocking: references starting with 'TEST_SUCCESS' will pass.
        if (app()->environment('local', 'testing')) {
            if (str_starts_with($reference, 'TEST_SUCCESS')) {
                return true;
            }
            if (str_starts_with($reference, 'TEST_FAIL')) {
                return false;
            }
        }

        try {
            if ($gateway === 'paystack') {
                return $this->verifyPaystack($reference);
            } elseif ($gateway === 'stripe') {
                return $this->verifyStripe($reference);
            }
        } catch (\Exception $e) {
            Log::error("Payment verification failed: " . $e->getMessage());
            return false;
        }

        return false;
    }

    private function verifyPaystack(string $reference): bool
    {
        $secretKey = config('services.paystack.secret_key') ?? env('PAYSTACK_SECRET_KEY');
        
        if (!$secretKey) {
            Log::warning("Paystack secret key not configured.");
            return false;
        }

        $response = Http::withToken($secretKey)
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if ($response->successful() && $response->json('data.status') === 'success') {
            return true;
        }

        return false;
    }

    private function verifyStripe(string $reference): bool
    {
        // Stripe typically uses webhooks, but for a simple verification endpoint flow:
        $secretKey = config('services.stripe.secret_key') ?? env('STRIPE_SECRET');

        if (!$secretKey) {
            Log::warning("Stripe secret key not configured.");
            return false;
        }

        // Simplistic check for a PaymentIntent status
        $response = Http::withToken($secretKey)
            ->get("https://api.stripe.com/v1/payment_intents/{$reference}");

        if ($response->successful() && $response->json('status') === 'succeeded') {
            return true;
        }

        return false;
    }
}
