<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentSection extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function enrollmentLesson()
    {
        return $this->hasMany(EnrollmentLesson::class);
    }

    public function courseSection()
    {
        return $this->belongsTo(CourseSection::class);
    }
}
