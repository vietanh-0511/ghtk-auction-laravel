<?php

namespace App\Services\Product;

use App\Models\Asset;

class AssetFilesHandle
{
    public function handle($request, $assetable, $assetableType)
    {
        foreach ($request->assets as $asset) {
            $mimeType = explode('.', $asset);
            Asset::create([
                'file_name' => $asset,
                'mime_type' => end($mimeType),
                'assetable' => $assetable,
                'assetable_type' => $assetableType
            ]);
        }
    }
}
