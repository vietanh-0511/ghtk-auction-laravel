<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSessionRequest extends FormRequest
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
            "start_price" => ['required', 'numeric', 'min:0'],
            "price_step" => ['required', 'numeric', 'min:0'],
            "product_id" => [
                'required',
                'numeric',
                Rule::unique('App\Models\Session')->ignore($this->id)->whereNull('deleted_at')
            ],
            "auction_id" => ['required', 'numeric']
        ];
    }
}
