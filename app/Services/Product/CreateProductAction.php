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
        if ($request->has('assets')) {
            $assetableType = Product::class;
            $assetable = $store->id;
            $this->assetFilesHandle->handle($request, $assetable, $assetableType);
        }
    }
}
