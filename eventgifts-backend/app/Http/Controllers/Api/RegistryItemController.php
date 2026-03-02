<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRegistryItemRequest;
use App\Models\Event;
use App\Models\RegistryItem;
use Illuminate\Support\Facades\Auth;

class RegistryItemController extends Controller
{
    public function index(Event $event)
    {
        // For Phase 1.5, we allow the host to see their items.
        // We'll broaden this for guests later.
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->registryItems);
    }

    public function store(StoreRegistryItemRequest $request, Event $event)
    {
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item = $event->registryItems()->create($request->validated());

        return response()->json($item, 201);
    }

    public function update(Request $request, RegistryItem $item)
    {
        if ($item->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_split_allowed' => 'sometimes|boolean',
            'type' => 'sometimes|in:fixed,cash_fund',
            'image_url' => 'nullable|url',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(RegistryItem $item)
    {
        if ($item->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Registry item deleted successfully']);
    }
}
