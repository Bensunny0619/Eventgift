<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreThankYouVideoRequest;
use App\Models\Contribution;
use App\Models\ThankYouVideo;
use Illuminate\Support\Facades\Auth;

class ThankYouVideoController extends Controller
{
    public function store(StoreThankYouVideoRequest $request, Contribution $contribution)
    {
        // Check if user is the host of the event
        if ($contribution->registryItem->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $video = $contribution->thankYouVideo()->updateOrCreate(
            ['contribution_id' => $contribution->id],
            ['video_url' => $request->video_url]
        );

        return response()->json($video, 201);
    }

    public function show(Contribution $contribution)
    {
        $video = $contribution->thankYouVideo;

        if (!$video) {
            return response()->json(['message' => 'Video not found'], 404);
        }

        // Mark as watched if not already
        if (!$video->watched_at) {
            $video->update(['watched_at' => now()]);
        }

        return response()->json($video);
    }
}
