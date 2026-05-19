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

        $event = Event::with('host')->findOrFail($validated['event_id']);
        if ($event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $guest = Guest::create($validated);

        if (!empty($guest->email)) {
            try {
                // Send invitation email in the background if they have an email address
                Mail::to($guest->email)->send(new EventInvitationMail($event, $guest));
            } catch (\Exception $e) {
                // Log error but don't fail the request
                \Illuminate\Support\Facades\Log::error('Failed to send invitation email: ' . $e->getMessage());
            }
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

    public function resendInvitation(Guest $guest)
    {
        if ($guest->event->host_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (empty($guest->email)) {
            return response()->json(['message' => 'Guest has no email address'], 422);
        }

        $event = $guest->event;
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        $event->load('host');
        
        try {
            Mail::to($guest->email)->send(new EventInvitationMail($event, $guest));
            return response()->json(['message' => 'Invitation resent successfully']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to resend invitation email: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send email'], 500);
        }
    }

    public function publicShow(Guest $guest)
    {
        return response()->json($guest->load('event.host'));
    }

    public function rsvp(Request $request, Guest $guest)
    {
        $validated = $request->validate([
            'status' => 'required|in:Confirmed,Declined',
        ]);

        $guest->update($validated);

        return response()->json([
            'message' => 'RSVP updated successfully',
            'guest' => $guest
        ]);
    }

    public function publicRsvp(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'status' => 'required|in:Confirmed,Declined',
        ]);

        $guest = Guest::where('event_id', $event->id)
            ->where('email', $validated['email'])
            ->first();

        if ($guest) {
            $guest->update([
                'name' => $validated['name'],
                'status' => $validated['status']
            ]);
        } else {
            $guest = Guest::create([
                'event_id' => $event->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'status' => $validated['status'],
                'tier' => 'Standard'
            ]);
        }

        return response()->json([
            'message' => 'RSVP submitted successfully',
            'guest' => $guest
        ]);
    }
}
