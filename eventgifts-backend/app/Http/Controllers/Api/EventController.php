<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->events()->with('registryItems')->get());
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

        return response()->json($event->load('registryItems'));
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
            'cover_image_url' => 'nullable|url',
            'status' => 'sometimes|required|string|in:active,past,cancelled',
        ]);

        $event->update($validated);

        return response()->json($event);
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
