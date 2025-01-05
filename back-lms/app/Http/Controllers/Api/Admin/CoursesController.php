<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseStoreRequest;
use App\Http\Requests\CourseTableFiltersRequest;
use App\Http\Requests\CourseUpdateRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

class CoursesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getCourse(Course $course)
    {
        return new CourseResource($course);
    }

    public function getCourses(CourseTableFiltersRequest $request)
    {
        return Course::filters($request->validated())->paginate($request->get('size') ?? 10);
    }

    public function store(CourseStoreRequest $request, Course $course)
    {
        // if teacher
        $user = auth('sanctum')->user();

        return $user->courses()->create(array_merge($request->validated(), ['status' => 'draft']));
    }

    public function destroy(Course $course)
    {
        $course->enrollments()->update(['is_active' => 0]);
        $course->delete();
    }

    public function update(CourseUpdateRequest $request, Course $course)
    {
        $previewImageFile = $request->file('preview_image_file');
        
        $previewImage = $course->preview_image;
        if ($previewImageFile) {
            $previewImage = $request->file('preview_image_file')->store('/public');
        }

        $data = $request->validated();
        $data['preview_image'] = str_replace('public/', '', $previewImage);
        unset($data['preview_image_file']);

        if (isset($data['status'])) {
            unset($data['status']);
        }

        $courseExists = Course::where('title', $request->get('title'))->where('id', $course->id)->first();

        if ($courseExists) {
            $data['title'] = $course->title;
        }

        $course->update($data);
    }

    public function publish(Request $request, Course $course)
    {
        if ($request->get('status') === 'draft') {
            $course->update(['status' => 'draft']);
            $course->enrollments()->update(['is_active' => 0]);
        } else {
            $courseSections = $course->courseSections->load('sectionLessons');

            $can = !!$courseSections->count();
            foreach ($courseSections as $courseSection) {
                if ($courseSection->sectionLessons()->count() === 0) {
                    $can = false;
                    break;
                }
            }

            if (!$can) {
                return response()->json(['message' => 'A course needs to have sections and each sections needs to have lessons'], 400);
            }

            $course->enrollments()->update(['is_active' => 1]);
            $course->update(['status' => 'public']);
        }
    }
}
