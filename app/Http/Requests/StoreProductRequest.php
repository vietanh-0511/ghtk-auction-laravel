<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Unique;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required'],
            'description' => ['required'],
            'assets' => ['required', 'max:2048', 'array'],
            'assets.*' => ['url', 'regex:~^(https?)://res\.cloudinary\.com/[a-zA-Z-_\d]+/image/upload/v\d+(/[a-zA-Z-_\d]+)+\.(jpg|png|jpeg)$~']
        ];
    }
}
