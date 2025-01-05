<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Enrollment;
use App\Models\EnrollmentQuiz;
use App\Models\QuestionOption;
use App\Models\SectionLesson;
use Illuminate\Http\Request;

class EnrollmentsController extends Controller
{
    public function store(Request $request)
    {
        $user = auth('sanctum')->user();

        $course = Course::public()->findOrFail($request->get('id'));

        $enrollment = Enrollment::create([
            'user_id' => auth('sanctum')->user()->id,
            'course_id' => $course->id,
            'enrollment_date' => now(),
            'completed' => false,
        ]);

        $courseSection = CourseSection::where('course_id', $request->get('id'))->orderBy('order', 'asc')->first();

        $section = $enrollment->sections()->create([
            'course_section_id' => $courseSection->id,
            'completed_lessons' => 0,
            'started_at' => now(),
        ]);

        $enrollment->lessons()->create([
            'section_lesson_id' => $courseSection->sectionLessons()->orderBy('order', 'asc')->first()?->id,
            'enrollment_section_id' => $section->id,
            'is_completed' => false,
        ]);

        $paths = $course->paths()->pluck('id');

        // connect the user with allt the paths this course is connected with
        $user->userPaths()->syncWithoutDetaching($paths);
    }

    public function updateEnrollmentOnVisit(Request $request, Enrollment $enrollment, CourseSection $courseSection, SectionLesson $sectionLesson)
    {
        $enrollment = auth('sanctum')->user()->enrollments()->findOrFail($enrollment->id);

        // check if the course data is valid
        $courseSection = $enrollment->course()->public()->firstOrFail()->courseSections()->findOrFail($courseSection->id);
        $sectionLesson = $courseSection->sectionLessons()->findOrFail($sectionLesson->id);

        if (!$courseSection->sectionLessons()->count()) {
            return response()->json(['message' => 'Unable to find lessons'], 404);
        }

        $enrollmentSection = $enrollment
            ->sections()
            ->updateOrCreate(
                [
                    'course_section_id' => $courseSection->id
                ],
                [
                    'updated_at' => now(),
                ],
            );


        $enrollment
            ->lessons()
            ->updateOrCreate(
                [
                    'section_lesson_id' => $sectionLesson->id,
                ],
                [
                    'enrollment_section_id' => $enrollmentSection->id,
                    'updated_at' => now(),
                ],
            );
    }

    public function updateLessonComplete(Request $request, Enrollment $enrollment, CourseSection $courseSection, SectionLesson $sectionLesson)
    {
        $enrollment = auth('sanctum')->user()->enrollments()->findOrFail($enrollment->id);

        // check if the course data is valid
        $courseSection = $enrollment->course()->public()->firstOrFail()?->courseSections()->findOrFail($courseSection->id);
        $sectionLesson = $courseSection->sectionLessons()->findOrFail($sectionLesson->id);

        $enrollmentSection = $enrollment->sections()->where('course_section_id', $courseSection->id)->firstOrFail();
        $enrollmentLesson = $enrollment->lessons()->where('section_lesson_id', $sectionLesson->id)->firstOrFail();

        if ($enrollmentSection->completed_at || $enrollmentLesson->is_completed) {
            return response()->json([], 400);
        }

        //complete lesson
        $enrollmentLesson
            ->update([
                'updated_at' => now(),
                'completed_at' => now(),
                'is_completed' => true,
            ]);

        // check if section was completed
        $sectionCompleted = $enrollmentSection->completed_lessons + 1 === $courseSection->sectionLessons()->count();

        $enrollmentSection->update([
            'completed_lessons' => $enrollmentSection->completed_lessons + 1,
            'completed_at' => $sectionCompleted ? now() : null,
            'updated_at' => now(),
        ]);

        // move to next lesson as the current lesson if section not completed
        $nextSectionLesson = null;
        if (!$sectionCompleted) {
            $nextSectionLesson = SectionLesson::where('course_section_id', $courseSection->id)
                ->where('order', '>', $sectionLesson->order)
                ->orderBy('order', 'asc')->first();

            if ($nextSectionLesson) {
                $enrollment
                    ->lessons()
                    ->updateOrCreate(
                        [
                            'section_lesson_id' => $nextSectionLesson->id
                        ],
                        [
                            'enrollment_section_id' => $enrollmentSection->id,
                            'updated_at' => now()->addSeconds(5),
                        ],
                    );
            }
        }

        // if section completed, move to next section and first lesson
        if ($sectionCompleted) {
            $courseSection = $enrollment->course->courseSections()
            ->where('id', '!=', $courseSection->id)
            ->where('order', '>=', $courseSection->order)
            ->orderBy('order', 'asc')
            ->first();

            // if new section exists
            if ($courseSection) {
                $nextSectionLesson = $courseSection->sectionLessons()->orderBy('order', 'asc')->first();

                $enrollmentNextSection = $enrollment
                    ->sections()
                    ->updateOrCreate(
                        [
                            'course_section_id' => $courseSection->id
                        ],
                        [
                            'updated_at' => now()->addSeconds(5),
                        ],
                    );


                $enrollment
                    ->lessons()
                    ->updateOrCreate(
                        [
                            'section_lesson_id' => $nextSectionLesson->id
                        ],
                        [
                            'enrollment_section_id' => $enrollmentNextSection->id,
                            'updated_at' => now()->addSeconds(5),
                        ],
                    );
            }

            // check if course is completed
            $courseCompleted = $enrollment->sections_completed + 1 === $enrollment->course->courseSections()->count();

            $enrollment->update([
                'sections_completed' => $enrollment->sections_completed + 1,
                'completed' => $courseCompleted,
            ]);
        }

        return [
            'course_completed' => $enrollment->completed,
            'section_completed' => $sectionCompleted,
            'next_lesson' => $enrollment->lessons()->orderBy('updated_at', 'desc')->first()->sectionLesson,
            'next_section' => $enrollment->sections()->orderBy('updated_at', 'desc')->first()->courseSection,
        ];

    }

    public function updateQuiz(Request $request, Enrollment $enrollment, CourseSection $courseSection, SectionLesson $sectionLesson)
    {
        $request->validate([
            'answers.*.question_id' => 'required|exists:quiz_questions,id',
            'answers.*.options.*' => 'nullable|exists:question_options,id',
        ]);

        $answers = $request->get('answers');

        $enrollment = auth('sanctum')->user()->enrollments()->findOrFail($enrollment->id);

        // check if the course data is valid
        $courseSection = $enrollment->course()->public()->firstOrFail()->courseSections()->findOrFail($courseSection->id);
        $sectionLesson = $courseSection->sectionLessons()->findOrFail($sectionLesson->id);

        $enrollmentSection = $enrollment->sections()->where('course_section_id', $courseSection->id)->firstOrFail();
        $enrollmentLesson = $enrollment->lessons()->where('section_lesson_id', $sectionLesson->id)->firstOrFail();

        if (!$sectionLesson->quiz()->first()) {
            return response()->json([], 404);
        }

        $enrollmentQuiz = $enrollment->quizzes()->where('section_lesson_id', $sectionLesson->id)->first();

        if ($enrollmentQuiz) {
            return response()->json(['message' => 'Something went wrong, please contact the admin!'], 400);
        }

        $score = 0;
        $totalScore = QuestionOption::whereIn('quiz_question_id', $sectionLesson->quiz->questions()->pluck('id'))->where('is_correct', 1)->count() * 10;
        foreach ($answers as $answer) {
            $question = $sectionLesson->quiz->questions()->where('id', $answer['question_id'])->firstOrFail();
            $score += $question->options()->whereIn('id', $answer['options'])->where('is_correct', 1)->count() * 10;
        }

        $enrollmentQuiz = $enrollment->quizzes()->create([
            'section_lesson_id' => $sectionLesson->id,
            'score' => $score,
            'total_score' => $totalScore,
        ]);
    }
}
