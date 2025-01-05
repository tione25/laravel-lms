<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PathStoreRequest;
use App\Http\Requests\PathTableFiltersRequest;
use App\Http\Requests\PathUpdateRequest;
use App\Models\Path;
use App\Models\User;
use Illuminate\Http\Request;

class PathsController extends Controller
{

    public function getPaths(PathTableFiltersRequest $request)
    {
        return Path::filters($request->validated())->paginate($request->get('size') ?? 10);
    }

    public function getPath(Path $path)
    {
        return $path->load(['sections' => function ($q) {
            $q->orderBy('order', 'asc')->with('courses');
        }])->load('category');
    }

    public function store(PathStoreRequest $request, Path $path)
    {
        // if teacher
        $user = auth('sanctum')->user();

        return $user->paths()->create($request->validated());
    }

    public function update(PathUpdateRequest $request, Path $path)
    {
        $previewImageFile = $request->file('preview_image_file');
        
        $previewImage = $path->preview_image;
        if ($previewImageFile) {
            $previewImage = $request->file('preview_image_file')->store('/public');
        }

        $data = $request->validated();
        $data['preview_image'] = str_replace('public/', '', $previewImage);
        unset($data['preview_image_file']);

        $pathExists = Path::where('title', $request->get('title'))->first();

        if ($pathExists) {
            $data['title'] = $path->title;
        }

        $path->update($data);
    }

    public function publish(Request $request, Path $path)
    {
        if ($request->get('status') === 'draft') {
            $path->update(['status' => 'draft']);
        }

        if ($request->get('status') === 'public') {
            if ($path->sections->count() === 0) {
                return response()->json(['message' => 'This path has no sections and can not be published.'], 400);
            }

            if ($path->courses->count() === 0) {
                return response()->json(['message' => 'This path has no courses and can not be published.'], 400);
            }

            $coursesNotPublished = $path->courses()->where('status', 'draft')->count();

            if ($coursesNotPublished) {
                return response()->json(['message' => 'This path contains courses that have not been published.'], 400);
            }

            $path->update(['status' => 'public']);
        }
    }

    public function destroy(Path $path)
    {
        $path->sections()->delete();
        $path->courses()->detach();
        $path->delete();

        \DB::table('user_paths')->where('path_id', $path->id)->delete();

    }
}
