<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PathUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => ['required', 'string'],
            "category_id" => ['required', 'exists:categories,id'],
            "description" => ['nullable'],
            "short_description" => ['nullable'],
            "meta_title" => ['nullable'],
            "meta_keywords" => ['nullable'],
            "meta_description" => ['nullable'],
            "preview_image_file" => ['nullable', 'file'],
        ];
    }
}
