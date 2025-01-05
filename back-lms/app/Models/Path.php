<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Path extends Model
{
    use HasFactory;

    protected $appends = [
        'sections_count',
        'courses_count',
        'percentage_completed',
        'path_current_user',
    ];

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function setTitleAttribute($value)
    {
        $this->attributes["title"] = $value;
        $this->attributes["slug"] = \Str::slug($value);
    }

    public function sections()
    {
        return $this->hasMany(PathSection::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class)->withPivot('order');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublic($query)
    {
        return $this->where('status', 'public');
    }

    public function scopeFilters($query, array $filters = [])
    {
        return $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                return $query->where('title', 'LIKE', '%' . $search . '%');
            })
            ->when($filters['category'] ?? null, function ($q) use ($filters) {
                return $q->where('category_id', $filters['category']);
            })->when($filters['order'] ?? null, function ($q, $order) use ($filters) {
                return $q->orderBy('created_at', $filters['order'] ?? 'desc');
            });
    }

    public function getSectionsCountAttribute()
    {
        return $this->sections->count();
    }

    public function getCoursesCountAttribute()
    {
        return $this->courses->count();
    }

    public function getPercentageCompletedAttribute()
    {
        $sectionsCompleted = $this->sections->filter(function ($section) {
            return $section->percentage_completed == 100;
        });

        if (count($sectionsCompleted) === 0) {
            return 0;
        }

        return (count($sectionsCompleted) / $this->sections_count) * 100;
    }

    public function getPathCurrentUserAttribute(): bool
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return false;
        }

        return !!$this->courses()->whereHas('enrollments', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();
    }
}
