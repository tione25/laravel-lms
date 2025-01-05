<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function boot()
    {
        JsonResource::withoutWrapping();
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'preview_image' => $this->preview_image,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'meta_title' => $this->meta_title,
            'meta_keywords' => $this->meta_keywords,
            'meta_description' => $this->meta_description,
            'course_sections_num' => $this->courseSections->count(),
            'category' => $this->category,
            'is_free' => $this->is_free,
            'status' => $this->status,
            'type' => $this->type,
            'sections' => $this->courseSections,
            'user' => $this->user,
        ];
    }
}
