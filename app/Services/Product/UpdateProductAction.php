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
        Product::where('id', $id)
            ->update([
                'name' => $request->name,
                'description' => $request->description
            ]);
        if ($request->has('assets')) {
            $assetableType = Product::class;
            $assetable = $id;
            $this->assetFilesHandle->handle($request, $assetable, $assetableType);
        }
    }
}
