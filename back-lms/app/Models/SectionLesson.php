<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectionLesson extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $with = ['quiz'];

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class);
    }

    public function setTitleAttribute($value)
    {
        $this->attributes["title"] = $value;
        $this->attributes["slug"] = \Str::slug($value);
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }

    public function enrollmentLessons()
    {
        return $this->hasMany(EnrollmentLesson::class);
    }
}
