<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseFiltersRequest;
use App\Http\Resources\CourseResource;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;

class CoursesController extends Controller
{
    public function getLatestCourses()
    {
        return CourseResource::collection(Course::public()->with('user')->orderBy('created_at', 'desc')->get()->take(3));
    }

    
    public function getRelatedCourses(Course $course, Category $category)
    {
        return CourseResource::collection(
            Course::where('category_id', $category->id)
            ->with('user')
            ->where('id', '!=', $course->id)
            ->public()
            ->orderByRaw("RAND()")
            ->get()
            ->take(3)
        );
    }

    public function getCourses(CourseFiltersRequest $request)
    {
        $user = auth('sanctum')->user();  

        $perPage = 12; // Adjust the number of users per page as needed
        $cursor = $request->query('cursor', null);

        $query = Course::with('user')->public()->filters($request->validated())->with('category');

        if ($cursor) {
            $query->where('id', $request->validated('order') === 'asc' ? '>' : '<', $cursor); // Example assuming 'id' is your primary key
        }
        
        if ($user) {
            $query->with([
                'enrollments' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                }
            ]);
        }

        $courses = $query->limit($perPage)->get();

        $hasNext = $courses->count() === $perPage; // Check if there are more users
        $nextCursor = $hasNext ? $courses->last()->id : null; // Set next_cursor if applicable

        return response()->json([
            'data' => $courses->toArray(),
            'nextCursor' => $nextCursor,
        ]);


    }

    public function getCourse(Request $request, string $slug)
    {
        $user = auth('sanctum')->user();
        $course = Course::with('category')->public()->where('slug', $slug)->firstOrFail();
        $enrollment = $user?->enrollments()->where('user_id', $user->id)->where('course_id', $course->id)?->first();

        if ($user && $enrollment) {
        return $enrollment->course()->where('slug', $slug)
                ->with([
                    'courseSections.enrollmentSections' => function ($q) use ($enrollment) {
                        $q->where('enrollment_id', $enrollment?->id);
                    }
                ])
                ->with([
                    'courseSections.sectionLessons.enrollmentLessons' => function ($q) use ($enrollment) {
                        $q->where('enrollment_id', $enrollment?->id);
                    }
                ])
                ->with([
                    'enrollments' => function ($q) use ($user, $course) {
                        $q->where('user_id', $user->id)
                            ->with('sections', 'lessons')
                            ->with('quizzes');
                    }
                ])->first();
        }

        return Course::with('courseSections.sectionLessons')->with('category')->public()->where('slug', $slug)->firstOrFail();
    }

}
