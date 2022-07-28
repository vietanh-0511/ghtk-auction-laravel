<?php

namespace App\Services\Product;

use App\Models\Asset;

class AssetFilesHandle
{
    // minh chi lam upload file thoi
    public function handle($request, $store)
    {
        $files = $request->file('assets');
        $allowedfileExtension = ['jpg', 'png'];
        $flag = true;
        // kiểm tra tất cả các files xem có đuôi mở rộng đúng không
        foreach ($files as $file) {
            $fileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $check = in_array($extension, $allowedfileExtension);
            if (!$check) {
                // nếu có file nào không đúng đuôi mở rộng thì đổi flag thành false
                $flag = false;
                break;
            }
        }

        if (!$flag) {
            return false;
        }

        // duyệt từng ảnh và thực hiện lưu
        foreach ($request->assets as $asset) {
            // $fileName = $asset->store('assets');
            Asset::create([
                'file_name' => $fileName,
                'mime_type' => $extension,
                'assetable' => $store->id,
                'assetable_type' => $store->getTable()
            ]);
        }
    }
}
