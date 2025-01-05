<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Enrollment;
use App\Models\EnrollmentLesson;
use App\Models\EnrollmentQuiz;
use App\Models\EnrollmentSection;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class CourseSectionsController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'title' => 'required',
            //'status' => 'required'
        ]);

        $sectionExists = $course->courseSections()->where('title', $request->get('title'))->first();

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a section named like this.']]], 422);
        }

        // if teacher
        $courseSection = $course->courseSections()->create([
            'title' => $request->get('title'),
            'status' => 'public',
            'order' => CourseSection::where('course_id', $course->id)->orderBy('order', 'desc')->first()?->order + 1 ?? 0,
        ]);

        $courseSection->course->update(['status' => 'draft']);

        // update all enrollments if they exist
        $enrollments = Enrollment::where('course_id', $courseSection->course_id)->count('id');
        if ($enrollments) {
            Enrollment::where('course_id', $courseSection->course_id);
            Enrollment::where('course_id', $courseSection->course_id)->update(['completed' => 0]);
        }

        return $courseSection;
    }

    public function update(Request $request, CourseSection $courseSection)
    {
        $request->validate([
            'title' => 'required',
            //'status' => 'required'
        ]);

        $sectionExists = CourseSection::where('id', '!=', $courseSection->id)->where('title', $request->get('title'))->first();

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a section named like this.']]], 422);
        }

        $courseSection->update([
            'title' => $request->get('title'),
            'status' => 'public',
        ]);

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a course named like that.']]], 422);
        }
    }

    public function destroy(CourseSection $courseSection)
    {
        $lessons = $courseSection->sectionLessons()->pluck('id');

        // update enrollment data
        Enrollment::whereHas('sections', function ($q) use ($courseSection) {
            $q->whereIn('id', $courseSection->enrollmentSections()->pluck('id'))
                ->whereNotNull('completed_at');
        })
            ->where('course_id', $courseSection->course_id)
            ->decrement('sections_completed');

        Enrollment::where('course_id', $courseSection->course_id)
            ->where('sections_completed', 0)->update(['completed' => false]);

        // delete all related data
        EnrollmentLesson::whereIn('section_lesson_id', $lessons)->delete();
        $courseSection->enrollmentSections()->delete();
        
        QuestionOption::whereIn('quiz_question_id', Quiz::whereIn('section_lesson_id', $lessons)->first()?->questions()->pluck('id') ?? [])->delete();
        QuizQuestion::whereIn('quiz_id', Quiz::whereIn('section_lesson_id', $lessons)->pluck('id'))->delete();
        Quiz::whereIn('section_lesson_id', $lessons)->delete();

        $courseSection->sectionLessons()->delete();
        $courseSection->delete();
    }

    public function updateOrder(Request $request)
    {
        $firstSection = CourseSection::findOrFail($request->get('first_section')['id']);
        $secondSection = CourseSection::findOrFail($request->get('second_section')['id']);

        $firstSection->update(['order' => $request->get('first_section')['order']]);
        $secondSection->update(['order' => $request->get('second_section')['order']]);
    }

}
