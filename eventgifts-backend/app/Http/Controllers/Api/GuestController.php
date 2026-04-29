<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Guest;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventInvitationMail;

class GuestController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        
        // Explicitly invited guests
        $invitedGuests = Guest::whereHas('event', function($query) use ($userId) {
            $query->where('host_id', $userId);
        })->with('event')->get()->map(function($g) {
            return [
                'id' => 'invited-' . $g->id,
                'name' => $g->name,
                'email' => $g->email,
                'status' => $g->status,
                'tier' => $g->tier,
                'event' => $g->event,
                'type' => 'invited'
            ];
        });

        // People who contributed (the "others")
        $events = Event::where('host_id', $userId)->with('registryItems.contributions.guest')->get();
        $contributors = collect();
        
        foreach ($events as $event) {
            foreach ($event->registryItems as $item) {
                foreach ($item->contributions as $contribution) {
                    if ($contribution->guest) {
                        $contributors->push([
                            'id' => 'contributor-' . $contribution->guest->id,
                            'name' => $contribution->guest->name,
                            'email' => $contribution->guest->email,
                            'status' => 'Confirmed', // If they paid/pledged, they are effectively confirmed
                            'tier' => 'Contributor',
                            'event' => $event,
                            'type' => 'contributor'
                        ]);
                    }
                }
            }
        }

        // Unique by email/name to avoid duplicates
        $allGuests = $invitedGuests->concat($contributors)->unique(function ($item) {
            return $item['email'] ?: $item['name'];
        })->values();

        return response()->json($allGuests);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'status' => 'sometimes|required|in:Pending,Confirmed,Declined',
            'tier' => 'sometimes|required|string|max:50',
        ]);

        $event = Event::findOrFail($validated['event_id']);
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $guest = Guest::create($validated);

        if (!empty($guest->email)) {
            // Send invitation email in the background if they have an email address
            Mail::to($guest->email)->send(new EventInvitationMail($event, $guest));
        }

        return response()->json($guest, 201);
    }

    public function update(Request $request, Guest $guest)
    {
        if ($guest->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'status' => 'sometimes|required|in:Pending,Confirmed,Declined',
            'tier' => 'sometimes|required|string|max:50',
        ]);

        $guest->update($validated);

        return response()->json($guest);
    }

    public function destroy(Guest $guest)
    {
        if ($guest->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $guest->delete();

        return response()->json(['message' => 'Guest removed successfully']);
    }
}
