<?php

namespace App\Services\Product;

class ImageFileHandle
{
    public function handle($request)
    {
        if ($request->has('title_image')) {
            $file = $request->file('title_image');
            $fileName = $file->getClientOriginalName();
            $file->move(public_path('images'), $fileName);
        }
        $request->merge(['title_image' => $fileName]);
    }
}
