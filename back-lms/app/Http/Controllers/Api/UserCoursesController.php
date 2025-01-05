<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\User;

class UserCoursesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __invoke(User $user)
    {
        // if ($user->id != request()->user()->id) {
        //     abort(401);
        // }

        return CourseResource::collection($user->courses()->paginate(10));
    }
}
