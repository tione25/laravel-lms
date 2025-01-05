<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentLesson extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function enrollmentSection()
    {
        return $this->belongsTo(EnrollmentSection::class);
    }

    public function sectionLesson()
    {
        return $this->belongsTo(SectionLesson::class);
    }
}
