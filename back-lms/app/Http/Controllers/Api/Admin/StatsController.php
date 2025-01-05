<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Path;
use App\Models\User;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getStats(Request $request)
    {
        return response()->json([
            'users' => User::count(),
            'courses' => Course::count(),
            'paths' => Path::count(),
        ]);
    }
    
}
