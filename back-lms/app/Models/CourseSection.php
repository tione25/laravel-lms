<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSection extends Model
{
    use HasFactory;

    protected $with = ['sectionLessons'];

    protected $guarded = [];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function sectionLessons()
    {
        return $this->hasMany(SectionLesson::class)->orderBy('order', 'asc');
    }

    public function scopePublic($query)
    {
        return $query->where('status', 'public');
    }

    public function setTitleAttribute($value)
    {
        $this->attributes["title"] = $value;
        $this->attributes["slug"] = \Str::slug($value);
    }

    public function enrollmentSections()
    {
        return $this->hasMany(EnrollmentSection::class);
    }
}
