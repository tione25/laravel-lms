<?php

use App\Http\Controllers\Api\Admin\PathCoursesController;
use App\Http\Controllers\Api\Admin\PathsController as AdminPathsController;
use App\Http\Controllers\Api\Admin\PathSectionsController;
use App\Http\Controllers\Api\Admin\QuizzesController as AdminQuizzesController;
use App\Http\Controllers\Api\Admin\SectionLessonsController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Admin\UsersController as AdminUsersController;
use App\Http\Controllers\Api\CategoriesController;
use App\Http\Controllers\Api\Admin\CategoriesController as AdminCategoriesController;
use App\Http\Controllers\Api\Admin\CourseSectionsController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\EnrollmentsController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\PathsController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\Admin\CoursesController as AdminCoursesController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = User::whereHas('enrollments.course', function ($q) {
        $q->public()->latest();
    })
        ->with('enrollments.course.user')
        ->with('enrollments.sections', 'enrollments.lessons')
        ->with([
            'userPaths' => function ($q) {
                $q->where('status', 'public');
            }
        ])
        ->with('userPaths.user')
        ->find(auth('sanctum')->user()?->id);

    if (!$user) {
        $user = User::find(auth('sanctum')->user()?->id);
    }

    return $user;
});

Route::get('/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/register', [RegisterController::class, 'register']);
    Route::post('/confirm', [LoginController::class, 'confirm']);
    Route::post('/password/reset', [LoginController::class, 'recover']);
    Route::post('/password/reset/confirm', [LoginController::class, 'recoverConfirm']);
});

Route::get('/courses/{slug}', [CoursesController::class, 'getCourse']);
Route::get('/latest-courses', [CoursesController::class, 'getLatestCourses']);
Route::get('/related-courses/{course}/{category}', [CoursesController::class, 'getRelatedCourses']);
Route::get('/latest-paths', [PathsController::class, 'getLatestPaths']);
Route::get('/library', [CoursesController::class, 'getCourses']);
Route::get('/paths', [PathsController::class, 'getPaths']);
Route::get('/paths/{slug}', [PathsController::class, 'getPath']);
Route::post('/contact', [ContactController::class, 'contact']);

Route::get('/categories', [CategoriesController::class, 'getCategories']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/profile', [ProfileController::class, 'update']);
    // enrollments
    Route::post('/enrollments', [EnrollmentsController::class, 'store']);
    Route::post('/enrollments/section', [EnrollmentsController::class, 'store']);
    Route::patch('/enrollments/{enrollment}/sections/{courseSection}/lessons/{sectionLesson}', [EnrollmentsController::class, 'updateEnrollmentOnVisit']);
    Route::patch('/enrollments/{enrollment}/sections/{courseSection}/lessons/{sectionLesson}/complete', [EnrollmentsController::class, 'updateLessonComplete']);
    Route::patch('/enrollments/{enrollment}/sections/{courseSection}/lessons/{sectionLesson}/quiz', [EnrollmentsController::class, 'updateQuiz']);
    Route::post('/courses/feedback/{course}', [FeedbackController::class, 'store']);
});


Route::group(['middleware' => ['auth:sanctum', 'admin'], 'prefix' => 'admin'], function () {
    Route::get('/stats', [StatsController::class, 'getStats']);
    Route::get('/users', [AdminUsersController::class, 'getUsers']);
    Route::get('/quizzes', [AdminQuizzesController::class, 'getQuizzes']);

    Route::get('/categories', [AdminCategoriesController::class, 'getCategories']);
    Route::get('/categories/{category}', [AdminCategoriesController::class, 'getCategory']);
    Route::post('/categories', [AdminCategoriesController::class, 'store']);
    Route::patch('/categories/{category}', [AdminCategoriesController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoriesController::class, 'destroy']);

    // courses area
    Route::get('/courses', [AdminCoursesController::class, 'getCourses']);
    Route::get('/courses/{course}', [AdminCoursesController::class, 'getCourse']);
    Route::patch('/courses/{course}/publish', [AdminCoursesController::class, 'publish']);
    Route::post('/courses/{course}', [AdminCoursesController::class, 'update']);
    Route::post('/courses', [AdminCoursesController::class, 'store']);
    Route::delete('/courses/{course}', [AdminCoursesController::class, 'destroy']);

    // course sections ( chapters )
    Route::patch('/sections/order', [CourseSectionsController::class, 'updateOrder']);
    Route::post('/courses/{course}/sections', [CourseSectionsController::class, 'store']);
    Route::patch('/sections/{courseSection}', [CourseSectionsController::class, 'update']);
    Route::delete('/sections/{courseSection}', [CourseSectionsController::class, 'destroy']);

    // course sections lessons ( lessons )
    Route::patch('/lessons/order', [SectionLessonsController::class, 'updateOrder']);
    Route::post('/courses/{courseSection}/lessons', [SectionLessonsController::class, 'store']);
    Route::patch('/lessons/{sectionLesson}', [SectionLessonsController::class, 'update']);
    Route::delete('/lessons/{sectionLesson}', [SectionLessonsController::class, 'destroy']);

    // course sections lessons quiz
    Route::post('/sections/{courseSection}/quiz', [AdminQuizzesController::class, 'store']);
    Route::patch('/quizzes/{quiz}', [AdminQuizzesController::class, 'update']);
    Route::get('/quizzes/{quiz}', [AdminQuizzesController::class, 'getQuiz']);

    // courses quizzes area
    Route::post('/quizzes/{quiz}/questions', [AdminQuizzesController::class, 'addQuestion']);
    Route::patch('/quizzes/questions/{quizQuestion}', [AdminQuizzesController::class, 'updateQuestion']);
    Route::delete('/quizzes/questions/{quizQuestion}', [AdminQuizzesController::class, 'deleteQuestion']);

    Route::post('/quizzes/questions/{quizQuestion}', [AdminQuizzesController::class, 'addOption']);
    Route::patch('/quizzes/options/{questionOption}', [AdminQuizzesController::class, 'updateOption']);
    Route::delete('/quizzes/options/{questionOption}', [AdminQuizzesController::class, 'deleteOption']);

    // path
    Route::get('/paths', [AdminPathsController::class, 'getPaths']);
    Route::get('/paths/{path}', [AdminPathsController::class, 'getPath'])->name('paths.get');
    Route::post('/paths/{path}', [AdminPathsController::class, 'update'])->name('paths.update');
    Route::post('/paths', [AdminPathsController::class, 'store'])->name('paths.store');
    Route::patch('/paths/{path}/publish', [AdminPathsController::class, 'publish']);
    Route::delete('/paths/{path}', [AdminPathsController::class, 'destroy']);


    // path sections
    Route::post('/paths/{path}/sections', [PathSectionsController::class, 'store']);
    Route::patch('/paths/sections/{pathSection}', [PathSectionsController::class, 'update']);
    Route::patch('/paths/{path}/sections/order', [PathSectionsController::class, 'updateOrder']);
    Route::delete('/paths/sections/{pathSection}', [PathSectionsController::class, 'destroy']);


    // path sections courses
    Route::get('/paths/sections/{pathSection}/search-courses', [PathCoursesController::class, 'searchCourses']);
    Route::post('/paths/sections/{pathSection}', [PathCoursesController::class, 'store']);
    Route::patch('/paths/sections/{pathSection/order', [PathCoursesController::class, 'updateOrder']);
    Route::delete('/paths/sections/{pathSection}/courses/{course}', [PathCoursesController::class, 'destroy']);

});