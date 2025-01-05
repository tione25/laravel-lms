<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image',
        'is_active',
        'email_verified_at',
        'token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'course_enrollments_completed',
        'course_enrollments_progress',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function paths()
    {
        return $this->hasMany(Path::class);
    }

    public function userPaths()
    {
        return $this->belongsToMany(Path::class, 'user_paths', 'user_id', 'path_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function getCourseEnrollmentsCompletedAttribute()
    {
        return $this->enrollments()->whereHas('course', function ($q) {$q->public();})->where('completed', 1)->count();
    }

    public function getCourseEnrollmentsProgressAttribute()
    {
        return $this->enrollments()->whereHas('course', function ($q) {$q->public();})->where('completed', 0)->count();
    }

    public function scopeFilters($query, array $filters = [])
    {
        return $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                return $query->where('name', 'LIKE', '%' . $search . '%')
                    ->orWhere('email', 'LIKE', '%' . $search . '%');
            });
    }
}
