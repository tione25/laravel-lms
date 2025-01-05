<p>Reset your password, {{ $user->name }}</p>
<p>Please click on the link below to reset your account.</p>

<p><a href="{{ $url }}/password/reset/{{$user->email}}/{{$token}}">{{ $url }}/recover/{{$user->email}}/{{$token}}</a><p>