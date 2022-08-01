<?php

namespace App\Services\Product;

use App\Models\Asset;
use App\Supports\Responder;
use Exception;

class AssetFilesHandle
{
    public function handle($request, $store)
    {
        $files = $request->file('assets');
        $allowedfileExtension = ['jpg', 'png'];
        // kiểm tra đuôi mở rộng các files
        foreach ($files as $file) {
            $fileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $check = in_array($extension, $allowedfileExtension);

            if ($check == false) {
                throw new Exception('invalid file format');
            }
        }
        // duyệt từng ảnh và thực hiện lưu
        foreach ($request->assets as $asset) {
            $fileName = $asset->store('assets');
            Asset::create([
                'file_name' => $fileName,
                'mime_type' => $asset->getMimeType(),
                'assetable' => $store->id,
                'assetable_type' => $store->name
            ]);
        }
    }
}
