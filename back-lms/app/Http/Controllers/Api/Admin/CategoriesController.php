<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    
    public function getCategory(Category $category)
    {
        return $category;
    }

    public function getCategories(Request $request)
    {
        return Category::paginate($request->get('size') ?? 10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories,name',
        ]);

        Category::create([
            'name' => $request->get('name'),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required',
        ]);

        
        $categoryExists = Category::where('id', '!=', $category->id)->where('name', $request->get('name'))->first();

        if ($categoryExists) {
            return response()->json(['errors' => ['name' => ['You already have a category named like this.']]], 422);
        }

        $category->update([
            'name' => $request->get('name')
        ]);
    }

    public function destroy(Category $category)
    {
        $courseHaveCategory = $category->courses()->count();

        if ($courseHaveCategory) {
            return response()->json(['message' => 'This category can not be deleted for it is being used'], 400);
        }

        $category->delete();
    }
}
