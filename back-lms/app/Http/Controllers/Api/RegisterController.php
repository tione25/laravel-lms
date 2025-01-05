<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\RegistrationEmail;
use App\Models\User;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'email|required|unique:users,email',
            'name' => 'string|required|unique:users,name',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => \Hash::make( $request->get('password')),
            'token' => \Str::random(20),
            'is_active' => 0,
        ]);

        \Mail::to($user->email)->send(new RegistrationEmail($user));

    }
}
