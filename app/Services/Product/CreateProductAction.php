<?php

namespace App\Services\Product;

use App\Models\Product;

class CreateProductAction
{
    private $assetFilesHandle;

    public function __construct(AssetFilesHandle $assetFilesHandle)
    {
        $this->assetFilesHandle = $assetFilesHandle;
    }

    public function handle($request)
    {
        $store = Product::create($request->all());
        // dd($request->has('assets'));
        if ($request->has('assets')) {
            $this->assetFilesHandle->handle($request, $store);
        }
    }
}
