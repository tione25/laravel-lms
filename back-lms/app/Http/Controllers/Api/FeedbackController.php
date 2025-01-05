<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request, $slug)
    {
        $request->validate([
            'rate' => 'integer|required|min:1,max:5',
            'message' => 'nullable|string',
        ]);

        if ($request->get('rate') < 1 || $request->get('rate') > 5) {
            return response()->json(['message' => 'Invalid feedback!'], 400);
        }

        $user = auth('sanctum')->user();

        $course = Course::public()->where('slug', $slug)->firstOrFail();

        $enrollmentCompleted = $course->enrollments()->where('user_id', $user->id)->where('completed', 1)->first();

        if (!$enrollmentCompleted) {
            return response()->json(['message' => 'You can not give feed back before completing the course'], 400);
        }

        $courseHasFeedback = $course->feedbacks()->where('user_id', $user->id)->first();

        if ($courseHasFeedback) {
            return response()->json(['message' => 'You have already given your feedback to this course'], 400);
        }

        $course->feedbacks()->create([
            'user_id' => $user->id,
            'rate' => $request->get('rate'),
            'message' => $request->get('message')
        ]);
    }
}
