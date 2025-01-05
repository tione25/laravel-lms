<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $appends = [
        'sections_count',
        'feedback_rating',
    ];

    protected $with = ['category'];

    protected static function booted()
    {
        static::addGlobalScope('notDeleted', function (Builder $builder) {
            $builder->whereNull('deleted_at');
        });
    }

    public function getSectionsCountAttribute()
    {
        return $this->courseSections->count();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courseSections()
    {
        return $this->hasMany(CourseSection::class)->orderBy('order', 'asc');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function setTitleAttribute($value)
    {
        $this->attributes["title"] = $value;
        $this->attributes["slug"] = \Str::slug($value);
    }

    public function scopePublic($query)
    {
        $query->where('status', 'public');
    }

    public function paths()
    {
        return $this->belongsToMany(Path::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(CourseFeedback::class);
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

    public function getFeedbackRatingAttribute()
    {
        $count = $this->feedbacks()->public()->count();
        $totalRating =  $this->feedbacks()->public()->sum('rate');

        if ($count <= 0) {
            return 0;
        }

        return (integer) ($totalRating / $count);
    }
}
