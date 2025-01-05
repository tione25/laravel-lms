<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\RecoverPasswordEmail;
use App\Models\PasswordResetToken;
use App\Models\Path;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'email|required',
            'password' => 'required|string|min:8,'
        ]);

        if (!\Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'The provided credentials do not match our records.'
            ], 401);
        }

        $user = User::where('email', $request->get('email'))->whereNotNull('email_verified_at')->where('is_active', 1)->first();

        if (!$user) {
            return response()->json([
                'message' => 'This account has not been confirmed.'
            ], 401);
        }

        $user = User::whereHas('enrollments.course', function ($q) {
            $q->public();
        })
            ->with('enrollments.course')
            ->with('enrollments.sections', 'enrollments.lessons')
            ->with([
                'userPaths' => function ($q) {
                    $q->where('status', 'public');
                }
            ])
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            $user = User::where('email', $request->email)->first();
        }

        $this->updatePaths($user);

        $token = $user->createToken('spa_auth')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        \Auth::logout();

        return response()->json([
            'message' => 'Logging out successfully!',
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'email' => 'email|required',
            'token' => 'required'
        ]);

        $user = User::where('email', $request->get('email'))
            ->where('token', $request->get('token'))
            ->whereNull('email_verified_at')
            ->firstOrFail();

        $user->update([
            'email_verified_at' => now(),
            'is_active' => 1,
            'token' => null,
        ]);
    }

    public function recover(Request $request)
    {
        $request->validate([
            'email' => 'email|required',
        ]);

        try {
            $user = User::where('email', $request->get('email'))->firstOrFail();

            $existingToken = PasswordResetToken::where('email', $user->email)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($existingToken) {
                // Calculate the time difference between created_at and now
                $createdAt = Carbon::parse($existingToken->created_at);
                $now = now();
                $diffInMinutes = $createdAt->diffInMinutes($now);
    
                if ($diffInMinutes < 10) {
                    return response()->json([
                        'message' => 'A password reset token has already been sent recently. Please check your email or wait a few minutes before trying again.',
                    ], 429); // 429 Too Many Requests
                }
            }

           $passwordResetToken = PasswordResetToken::create([
                'email' => $user->email,
                'token' => \Str::random(20),
                'created_at' => now(),
            ]);

            \Mail::to($user->email)->send(new RecoverPasswordEmail($user, $passwordResetToken->token));

            return response()->json([
                'message' => 'success',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'We could not found your account.',
            ], 404);
        }
    }

    public function recoverConfirm(Request $request)
    {
        $request->validate([
            'email' => 'email|required',
            'token' => 'required',
            'password' => 'required|string|min:8',
        ]);

        try {
            $user = User::where('email', $request->get('email'))
                ->firstOrFail();

            $passwordResetToken = PasswordResetToken::where('email', $user->email)
                ->where('token', $request->get('token'))
                ->firstOrFail();
            

            $user->update([
                'email_verified_at' => now(),
                'password' => \Hash::make( $request->get('password')),
            ]);

            PasswordResetToken::where('email', $user->email)->delete();
        } catch(\Exception $e) {
            return response()->json([
                'message' => 'We can not reset your password.',
            ], 404);
        }
    }

    public function updatePaths(User $user)
    {
        $courses = $user->enrollments()->pluck('course_id');
        $paths = Path::whereHas('courses', function ($q) use ($courses) {
            $q->whereIn('course_id', $courses);
        })->pluck('id');

        $user->userPaths()->syncWithoutDetaching($paths);
    }
}
