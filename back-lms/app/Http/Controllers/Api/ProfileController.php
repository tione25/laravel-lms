<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $data = $request->validated();
        $user = auth('sanctum')->user();

        if (isset($data['email'])) {
            $emailExists = User::where('id', '!=', $user->id)->where('email', $data['email'])->first();

            if ($emailExists) {
                return response()->json(['errors' => ['email' => ['This email address is already taken.']]], 422);
            }
        }

        $profileImageFile = $request->file('profile_image_file');

        $profileImage = $user->profile_image;
        if ($profileImageFile) {
            $profileImage = $request->file('profile_image_file')->store('/public');

            $data = $request->validated();
            $data['profile_image'] = str_replace('public/', '', $profileImage);
            unset($data['profile_image_file']);
        }

        if (isset($data['password'])) {
            $data['password'] = \Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
    }
}
