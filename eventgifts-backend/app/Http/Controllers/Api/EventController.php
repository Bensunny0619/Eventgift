<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->events()->with('registryItems.contributions.guest')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string',
            'location_coords' => 'nullable|string',
            'template_id' => 'nullable|string',
            'cover_image_url' => 'nullable|url',
        ]);

        $event = Auth::user()->events()->create($validated);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->load(['registryItems.contributions.guest', 'host', 'guests']));
    }

    public function publicShow(Event $event)
    {
        return response()->json($event->load(['registryItems', 'host']));
    }

    public function update(Request $request, Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string',
            'location_coords' => 'nullable|string',
            'template_id' => 'nullable|string',
            'cover_image_url' => 'nullable|string',
            'status' => 'sometimes|required|string|in:active,past,cancelled',
            'theme_color' => 'nullable|string',
            'welcome_message' => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function uploadCover(Request $request, Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('covers', 'public');
            $event->cover_image_url = '/storage/' . $path;
            $event->save();

            return response()->json([
                'message' => 'Cover image uploaded successfully',
                'cover_image_url' => $event->cover_image_url
            ]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    public function destroy(Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
