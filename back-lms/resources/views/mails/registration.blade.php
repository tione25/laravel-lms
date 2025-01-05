<p>Welcome to our LMS, {{ $user->name }}</p>
<p>Please click on the link below to confirm your account.</p>

<p><a href="{{ $url }}/confirm/{{$user->email}}/{{$user->token}}">{{ $url }}/confirm/{{$user->email}}/{{$user->token}}</a><p>