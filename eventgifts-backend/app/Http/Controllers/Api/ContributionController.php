<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreContributionRequest;
use App\Models\Contribution;
use App\Models\RegistryItem;
use App\Services\PaymentService;
use Illuminate\Support\Facades\Auth;

class ContributionController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function store(StoreContributionRequest $request, RegistryItem $item)
    {
        $contribution = $item->contributions()->create([
            'guest_id' => Auth::id(),
            'amount' => $request->amount,
            'message_text' => $request->message_text,
            'video_note_url' => $request->video_note_url,
            'status' => 'pledged', // Start as pledged until verified
            'transaction_reference' => $request->transaction_reference,
        ]);

        return response()->json([
            'message' => 'Contribution pledged successfully. Please verify payment.',
            'contribution' => $contribution
        ], 201);
    }

    public function verify(Request $request, Contribution $contribution)
    {
        if ($contribution->status === 'paid') {
            return response()->json(['message' => 'Contribution already verified.'], 200);
        }

        $gateway = $request->input('gateway', 'paystack');
        $isVerified = $this->paymentService->verifyReference($contribution->transaction_reference, $gateway);

        if ($isVerified) {
            $contribution->update(['status' => 'paid']);
            
            // Increment the item balance only now
            $contribution->registryItem->increment('amount_raised', $contribution->amount);

            return response()->json([
                'message' => 'Payment verified successfully.',
                'contribution' => $contribution
            ]);
        }

        return response()->json(['message' => 'Payment verification failed.'], 400);
    }
}
