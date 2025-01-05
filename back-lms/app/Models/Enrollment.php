<?php

namespace App\Models;

use App\Models\Scopes\EnrollmentActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['current_section', 'current_lesson', 'percentage_completed'];

    protected static function booted()
    {
        static::addGlobalScope(new EnrollmentActiveScope);

    }

    public function student()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function sections()
    {
        return $this->hasMany(EnrollmentSection::class);
    }

    public function lessons()
    {
        return $this->hasMany(EnrollmentLesson::class);
    }

    public function quizzes()
    {
        return $this->hasMany(EnrollmentQuiz::class);
    }

    public function getCurrentSectionAttribute()
    {
        // I want the latest updated course section based on the latest lesson
        return $this->lessons()
            ->orderBy('updated_at', 'desc')
            ->first()?->sectionLesson()
            ->courseSection ?? $this->sections()->orderBy('updated_at', 'desc')?->first()?->courseSection;
    }

    public function getCurrentLessonAttribute()
    {
        // I want to get the latest lesson
        return $this->lessons()->orderBy('updated_at', 'desc')->first()?->sectionLesson;
    }

    public function getPercentageCompletedAttribute(): int
    {
        if (!$this->sections_completed)
            return 0;

        return($this->sections_completed / ($this?->course?->sections_count ?? 1)) * 100;
    }
}
