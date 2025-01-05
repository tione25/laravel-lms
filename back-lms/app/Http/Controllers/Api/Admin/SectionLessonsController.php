<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseSection;
use App\Models\Enrollment;
use App\Models\EnrollmentQuiz;
use App\Models\EnrollmentSection;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\SectionLesson;
use Illuminate\Http\Request;

class SectionLessonsController extends Controller
{
    public function store(Request $request, CourseSection $courseSection)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable|string',
            'type' => 'required',
            'video' => 'nullable|required_if:type,==,video',
            //'status' => 'required',
        ]);

        $sectionLessonExists = $courseSection->sectionLessons()->where('title', $request->get('title'))->first();


        if ($sectionLessonExists) {
            return response()->json(['errors' => ['title' => ['You already have a lesson named like this.']]], 422);
        }

        $courseSection->sectionLessons()->create([
            'course_id' => $courseSection->course_id,
            'order' => SectionLesson::where('course_section_id', $courseSection->id)->orderBy('order', 'desc')->first()?->order + 1 ?? 0,
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'video' => $request->get('video'),
            'type' => $request->get('type'),
            'status' => 'public',
        ]);

        $courseSection->course->update(['status' => 'draft']);

        // get all enrollment sections that are completed for this course section
        $enrollmentSections = EnrollmentSection::where('course_section_id', $courseSection->id)
                                ->whereNotNull('completed_at')->pluck('id');
        // make them uncompleted
        EnrollmentSection::whereIn('id', $enrollmentSections)->update(['completed_at' => null]);
        // update enrollment
        Enrollment::whereHas('sections', function ($q) use ($enrollmentSections) {
            $q->whereIn('id', $enrollmentSections);
        })->update([
            'completed' => false,
            'sections_completed' => \DB::raw('sections_completed - 1'),
        ]);

        if (!count($enrollmentSections)) {
            Enrollment::where('course_id', $courseSection->course_id)->update(['completed' => false]);
        }
    }

    public function update(Request $request, SectionLesson $sectionLesson)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable|string',
            'type' => 'required',
            'video' => 'nullable|required_if:type,==,video',
            //'status' => 'required',
        ]);

        $sectionLessonExists = $sectionLesson
            ->courseSection
            ->sectionLessons()
            ->where('id', '!=', $sectionLesson->id)
            ->where('title', $request->get('title'))
            ->first();

        if ($sectionLessonExists) {
            return response()->json(['errors' => ['title' => ['You already have a lesson named like this.']]], 422);
        }

        $sectionLesson->update([
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'video' => $request->get('video'),
            'type' => $request->get('type'),
            'status' => 'public',
        ]);
    }

    public function destroy(SectionLesson $sectionLesson)
    {
        // delete all related data
        $courseSection = $sectionLesson->courseSection;

        // get all enrollment sections for which this lesson is completed
        $sections = $sectionLesson->enrollmentLessons()->where('is_completed', 1)->pluck('enrollment_section_id');
        // decrease the number of completed lessons in every section found that has this lesson completed
        $courseSection->enrollmentSections()->whereIn('id', $sections)->where('completed_lessons', '>', 0)->decrement('completed_lessons');
        // if reaches 0 get all the enrollment sections that need to be uncompleted and mark them as uncompleted
        $courseSection->enrollmentSections()->whereIn('id', $sections)->where('completed_lessons', 0)->update(['completed_at' => null]);
        $enrollments = Enrollment::whereHas('sections', function ($q) use ($sections) {
            $q->whereIn('id', $sections)->whereNull('completed_at');
        })->pluck('id');
        Enrollment::whereIn('id', $enrollments)->where('sections_completed', '>', 0)->decrement('sections_completed');
        Enrollment::whereIn('id', $enrollments)->where('sections_completed', 0)->update(['completed' => false]);

        $sectionLesson->enrollmentLessons()->delete();

        if ($sectionLesson->quiz) {
            EnrollmentQuiz::where('section_lesson_id', $sectionLesson->id)->delete();

            $quiz = Quiz::where('section_lesson_id', $sectionLesson->id)->first();
            QuestionOption::whereIn('quiz_question_id', $quiz->questions()->pluck('id'))->delete();
            $quiz->questions()->delete();
        }

        $sectionLesson->delete();

        if ($courseSection->sectionLessons()->count() === 0) {
            $courseSection->course->update(['status' => 'draft']);
        }
    }

    public function updateOrder(Request $request)
    {
        $firstLesson = SectionLesson::findOrFail($request->get('first_section_lesson')['id']);
        $secondLesson = SectionLesson::findOrFail($request->get('second_section_lesson')['id']);

        $firstLesson->update(['order' => $request->get('first_section_lesson')['order']]);
        $secondLesson->update(['order' => $request->get('second_section_lesson')['order']]);
    }

}
