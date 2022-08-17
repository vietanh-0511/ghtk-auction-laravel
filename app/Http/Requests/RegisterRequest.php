<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'full_name' => 'required|string|max:50',
            'email' => 'required|email|unique:App\Models\User|regex:/^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/',
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
