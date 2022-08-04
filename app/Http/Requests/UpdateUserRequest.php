<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        // dd($this->id);
        return [
            'full_name' => 'required|string|max:255',
            'email' => [
                'required',
                Rule::unique('users', 'email')->ignore($this->id)
            ],
            'password' => [
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
            ],
            'address' => 'required|string|max:500',
            'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:16',
        ];
    }
}
