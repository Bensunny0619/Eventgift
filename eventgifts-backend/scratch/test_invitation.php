<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

use App\Models\Event;
use App\Models\Guest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventInvitationMail;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Ensure we have a user and an event
$user = User::first();
if (!$user) {
    echo "No user found. Please run migrations/seeders.\n";
    exit;
}

$event = Event::where('host_id', $user->id)->first();
if (!$event) {
    echo "No event found for user. Creating one...\n";
    $event = Event::create([
        'host_id' => $user->id,
        'title' => 'Test Event',
        'date' => now()->addDays(7),
        'location' => 'Test Location',
    ]);
}

Auth::login($user);

echo "Testing guest invitation...\n";

$guestData = [
    'event_id' => $event->id,
    'name' => 'Test Guest',
    'email' => 'testguest@example.com',
    'status' => 'Pending',
    'tier' => 'Standard',
];

$guest = Guest::create($guestData);
echo "Guest created: " . $guest->id . "\n";

if (!empty($guest->email)) {
    echo "Sending email...\n";
    Mail::to($guest->email)->send(new EventInvitationMail($event, $guest));
    echo "Email sent.\n";
}

echo "Done.\n";
