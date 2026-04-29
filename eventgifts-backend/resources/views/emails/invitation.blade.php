<x-mail::message>
# You're Invited!

Hi {{ $guest->name }},

You have been invited to **{{ $event->title }}**! 

**Date:** {{ \Carbon\Carbon::parse($event->date)->format('F j, Y, g:i a') }}
**Location:** {{ $event->location ?? 'See event page for details' }}

{{ $event->description }}

We'd love for you to join us. You can view the event details and access the registry below.

@php
    // In a real app, you might want a config value or front-end URL here
    $url = rtrim(config('app.url'), '/') . ':5173/registry/' . $event->id;
@endphp

<x-mail::button :url="$url">
View Event & Registry
</x-mail::button>

We can't wait to celebrate with you!

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
