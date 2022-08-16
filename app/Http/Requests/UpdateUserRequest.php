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
        return [
            'full_name' => 'required|string|max:255',
            'email' => [
                'required',
                'regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/',
                Rule::unique('users', 'email')->ignore($this->id)
            ],
            'password' => [
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
            ],
            'address' => 'required|string|max:500',
            'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|digits:10',
        ];
    }
}
