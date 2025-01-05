<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionQuizStoreRequest;
use App\Http\Requests\SectionQuizUpdateRequest;
use App\Models\CourseSection;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\SectionLesson;
use App\Models\User;
use Illuminate\Http\Request;

class QuizzesController extends Controller
{

    public function getQuiz(Quiz $quiz)
    {
        return $quiz;
    }

    public function getQuizzes(Request $request)
    {
        return Quiz::paginate($request->get('size') ?? 5);
    }

    public function store(SectionQuizStoreRequest $request, CourseSection $courseSection)
    {
        $sectionLessonExists = $courseSection->sectionLessons()->where('title', $request->get('title'))->first();


        if ($sectionLessonExists) {
            return response()->json(['errors' => ['title' => ['You already have a quiz named like this.']]], 422);
        }

        $lesson = $courseSection->sectionLessons()->create([
            'course_id' => $courseSection->course_id,
            'title' => $request->validated('title'),
            'is_quiz' => true,
            'order' => SectionLesson::where('course_section_id', $courseSection->id)->orderBy('order', 'desc')->first()?->order + 1 ?? 0,
        ]);

        $lesson->quiz()->save(new Quiz([
            'title' => $lesson->title,
            'user_id' => User::find(1)->id,
        ]));
    }

    public function update(SectionQuizUpdateRequest $request, Quiz $quiz)
    {
        $sectionLessonExists = $quiz->sectionLesson
            ->courseSection
            ->sectionLessons()
            ->where('id', '!=', $quiz->sectionLesson->id)
            ->where('title', $request->get('title'))
            ->first();

        if ($sectionLessonExists) {
            return response()->json(['errors' => ['title' => ['You already have a quiz named like this.']]], 422);
        }


        $quiz->sectionLesson()->update(['title' => $request->validated('title')]);

        $quiz->update([
            'title' => $request->validated('title'),
        ]);
    }

    public function addQuestion(Request $request, Quiz $quiz)
    {
        $quiz->questions()->create([
            'question' => $request->get('question'),
            'description' => $request->get('description') ?? null,
        ]);
    }

    public function updateQuestion(Request $request, QuizQuestion $quizQuestion)
    {
        $quizQuestion->update([
            'question' => $request->get('question') ?? 'Untitled Question',
            'description' => $request->get('description') ?? null,
        ]);
    }

    public function deleteQuestion(QuizQuestion $quizQuestion)
    {
        $quizQuestion->delete();
        $quizQuestion->options()->delete();
    }

    public function addOption(Request $request, QuizQuestion $quizQuestion)
    {
        $quizQuestion->options()->create([
            'option' => $request->get('option') ?? 'Option',
            'is_correct' => $request->get('is_correct') ?? false,
        ]);
    }

    public function updateOption(Request $request, QuestionOption $questionOption)
    {
        $questionOption->update([
            'option' => $request->get('option'),
            'is_correct' => $request->get('is_correct') ?? false,
        ]);
    }

    public function deleteOption(QuestionOption $questionOption)
    {
        $questionOption->delete();
    }

}
