<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserTableFiltersRequest;
use App\Models\User;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getUsers(UserTableFiltersRequest $request)
    {
        return User::filters($request->validated())->paginate($request->get('size') ?? 5); 
    }
    
}
