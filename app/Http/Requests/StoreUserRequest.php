<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
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
            'full_name' => 'required|string|min:6|max:255',
            'email' => [
                'required',
                'email',
                'regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/',
                Rule::unique('App\Models\User', 'email')->whereNull('deleted_at')
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/',
            ],
            'address' => 'required|string|max:120',
            'phone' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|digits:10',
        ];
    }
}
