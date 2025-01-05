<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Path;
use App\Models\Course;
use App\Models\PathSection;
use Illuminate\Http\Request;

class PathCoursesController extends Controller
{
    public function store(Request $request, PathSection $pathSection)
    {
        $pathSection->courses()->attach([
            $request->get('course_id') => 
            [
                'order' => $pathSection->courses()->orderBy('pivot_order', 'desc')->first()?->pivot->order + 1 ?? 0,
                'path_id' => $pathSection->path->id,
            ]
        ]);
    }

    public function destroy(PathSection $pathSection, Course $course)
    {
        $pathSection->courses()->detach($course->id);
    }

    public function updateOrder(Request $request, PathSection $pathSection)
    {
        $pathSection->courses()->updateExistingPivot($request->get('first_course')['id'], ['order' => $request->get('first_course')['order']]);
        $pathSection->courses()->updateExistingPivot($request->get('second_course')['id'], ['order' => $request->get('second_course')['order']]);
    }

    public function searchCourses(Request $request, PathSection $pathSection)
    {
        $coursesIds = $pathSection->courses()->pluck('id');

        return Course::whereNotIn('id', $coursesIds)->where('title', 'like', '%' . $request->get('search') . '%')->get();
    }

}