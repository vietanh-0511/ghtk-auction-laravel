<?php

namespace App\Services\Product;

use App\Models\Asset;

class AssetFilesHandle
{
    public function handle($request, $assetable, $assetableType)
    {
        foreach ($request->assets as $asset) {
            if (!Asset::query()->where([
                ['file_name', '=', $asset],
                ['assetable', '=', $assetable],
                ['assetable_type', '=', $assetableType]
            ])->exists()) {
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
}
