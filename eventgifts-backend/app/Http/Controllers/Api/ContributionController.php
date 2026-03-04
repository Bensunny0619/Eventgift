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

    public function verify(Contribution $contribution)
    {
        $reference = request('transaction_reference');
        
        if ($contribution->transaction_reference !== $reference) {
            return response()->json(['message' => 'Invalid reference'], 422);
        }

        $paymentService = new PaymentService();
        $isVerified = $paymentService->verifyReference($reference);

        if ($isVerified) {
            $contribution->update(['status' => 'verified']);
            $contribution->registryItem->increment('amount_raised', $contribution->amount);
            return response()->json(['message' => 'Verification successful', 'contribution' => $contribution->load('thankYouVideo')]);
        }

        return response()->json(['message' => 'Verification failed'], 400);
    }

    public function search(Request $request)
    {
        $contribution = Contribution::where('transaction_reference', $request->transaction_reference)->first();
        
        if (!$contribution) {
            return response()->json(['message' => 'Contribution not found'], 404);
        }

        return response()->json($contribution);
    }
}
