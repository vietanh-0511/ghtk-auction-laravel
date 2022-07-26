<?php

namespace App\Services\Product;

use App\Models\Product;

class UpdateProductAction
{
    private $assetFilesHandle;

    public function __construct(AssetFilesHandle $assetFilesHandle)
    {
        $this->assetFilesHandle = $assetFilesHandle;
    }

    public function handle($request, $id)
    {
        $store = Product::where('id', $id)->update($request);
        if ($request->has('assets')) {
            $this->assetFilesHandle->handle($request, $store);
        }
    }
}
