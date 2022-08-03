<?php

namespace App\Services\Product;

use App\Models\Asset;

class UploadProductImages
{
    public function handle($request)
    {
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            foreach ($files as $file) {
                $fileName = $file->getClientOriginalName();
                $file->move(public_path('images'), $fileName);
                foreach ($request->images as $photo) {
                    $filename = $photo->store('photos');
                    Asset::create([
                        'url' => $filename
                    ]);
                    echo "Upload Successfully";
                }
            }
        } 
    }
}
