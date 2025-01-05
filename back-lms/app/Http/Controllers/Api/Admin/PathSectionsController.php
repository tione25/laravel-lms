<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Path;
use App\Models\PathSection;
use Illuminate\Http\Request;

class PathSectionsController extends Controller
{
    public function store(Request $request, Path $path)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable|string',
            //'status' => 'required'
        ]);

        $sectionExists = $path->sections()->where('title', $request->get('title'))->first();

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a section named like this.']]], 422);
        }

        $courseSection = $path->sections()->create([
            'title' => $request->get('title'),
            'status' => 'public',
            'description' => $request->get('description'),
            'order' => PathSection::where('path_id', $path->id)->orderBy('order', 'desc')->first()?->order + 1 ?? 0,
        ]);

        $courseSection->path->update(['status' => 'draft']);
    }

    public function update(Request $request, PathSection $pathSection)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'nullable|string'
            //'status' => 'required'
        ]);

        $sectionExists = PathSection::where('id', '!=', $pathSection->id)->where('title', $request->get('title'))->first();

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a section named like this.']]], 422);
        }

        $pathSection->update([
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'status' => 'public',
        ]);

        if ($sectionExists) {
            return response()->json(['errors' => ['title' => ['You already have a course named like that.']]], 422);
        }
    }

    public function destroy(PathSection $pathSection)
    {
        $pathSection->courses()->detach();
        $pathSection->delete();
    }

    public function updateOrder(Request $request)
    {
        $firstSection = PathSection::findOrFail($request->get('first_section')['id']);
        $secondSection = PathSection::findOrFail($request->get('second_section')['id']);

        $firstSection->update(['order' => $request->get('first_section')['order']]);
        $secondSection->update(['order' => $request->get('second_section')['order']]);
    }

}
