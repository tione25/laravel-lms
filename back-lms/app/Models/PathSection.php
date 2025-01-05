<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PathSection extends Model
{
    use HasFactory;

    protected $appends = [
        'courses_completed_count',
        'courses_count',
        'percentage_completed'
    ];

    protected $guarded = [];

    public function path()
    {
        return $this->belongsTo(Path::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_path')->withPivot('order');
    }

    public function getCoursesCompletedCountAttribute(): int
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return 0;
        }

        return $this->courses()->whereHas('enrollments', function ($q) use ($user) {
            $q->where('completed', 1)->where('user_id', $user->id);
        })->count();
    }

    public function getCoursesCountAttribute(): int
    {
        return $this->courses->count();
    }

    public function getPercentageCompletedAttribute(): int
    {
        if (!$this->courses_count) return 0;

        return ($this->courses_completed_count / $this->courses_count) * 100;
    }
}
