<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentQuiz extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
