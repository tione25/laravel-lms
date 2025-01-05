<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    
    protected $appends = [
        'courses_count',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function setNameAttribute($value)
    {
        $this->attributes["name"] = $value;
        $this->attributes["slug"] = \Str::slug($value);
    }

    public function getCoursesCountAttribute()
    {
        return $this->courses()->public()->count();
    }
}
