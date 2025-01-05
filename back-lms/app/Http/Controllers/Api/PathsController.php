<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseFiltersRequest;
use App\Http\Requests\PathFilterRequest;
use App\Http\Resources\CourseResource;
use App\Models\Path;
use Illuminate\Http\Request;

class PathsController extends Controller
{
    public function getPaths(PathFilterRequest $request)
    {
        $perPage = 12; // Adjust the number of users per page as needed
        $cursor = $request->query('cursor', null);

        $query = Path::public()->filters($request->validated())->with('category')->with('user');

        if ($cursor) {
            $query->where('id', $request->validated('order') === 'asc' ? '>' : '<', $cursor); // Example assuming 'id' is your primary key
        }

        $paths = $query->limit($perPage)->get();

        $hasNext = $paths->count() === $perPage; // Check if there are more users
        $nextCursor = $hasNext ? $paths->last()->id : null; // Set next_cursor if applicable

        return response()->json([
            'data' => $paths->toArray(),
            'nextCursor' => $nextCursor,
        ]);
    }

    public function getPath(Request $request, string $slug)
    {
        $user = auth('sanctum')->user();
        $path = Path::public()->with('category')->with([
            'sections.courses' => function ($q) {
                $q->public();
            }
        ])->where('slug', $slug)->firstOrFail();

        if ($user) {
            $path->load([
                'sections.courses.enrollments' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                }
            ]);
        }

        return $path;
    }

    public function getLatestPaths()
    {
        return Path::public()->orderBy('created_at', 'desc')->with('user')->get()->take(3);
    }

}
