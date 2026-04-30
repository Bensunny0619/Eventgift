<x-mail::message>
# You're Invited!

Hi **{{ $guest->name }}**,

You have been cordially invited to **{{ $event->title }}**! 

<x-mail::panel>
**Date:** {{ \Carbon\Carbon::parse($event->date)->format('F j, Y, g:i a') }}  
**Location:** {{ $event->location ?? 'See event page for details' }}
</x-mail::panel>

{{ $event->description }}

We would be honored to have you celebrate with us. You can view the event details and access our gift registry using the button below.

@php
    $frontendUrl = config('app.frontend_url');
    $url = rtrim($frontendUrl, '/') . '/registry/' . $event->id;
@endphp

<x-mail::button :url="$url">
View Event & Registry
</x-mail::button>

We look forward to seeing you there!

Warmly,  
**{{ $event->host->name }}**  
*via {{ config('app.name') }}*
</x-mail::message>
