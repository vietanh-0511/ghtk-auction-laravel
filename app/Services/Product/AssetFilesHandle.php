<?php

namespace App\Services\Product;

use App\Models\Asset;

class AssetFilesHandle
{
    public function handle($request, $store)
    {
        $files = $request->file('assets');
        $allowedfileExtension = ['jpg', 'png'];
        $exe_flg = true;
        // kiểm tra tất cả các files xem có đuôi mở rộng đúng không
        foreach ($files as $file) {
            $fileName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $check = in_array($extension, $allowedfileExtension);
            if (!$check) {
                // nếu có file nào không đúng đuôi mở rộng thì đổi flag thành false
                $exe_flg = false;
                break;
            }
        }

        if ($exe_flg) {
            // duyệt từng ảnh và thực hiện lưu
            foreach ($request->assets as $asset) {
                $fileName = $asset->store('assets');
                Asset::create([
                    'file_name' => $fileName,
                    'mime_type' => $extension,
                    'assetable' => $store->id,
                    'assetable_type' => $store->getTable()
                ]);
            }
        }
    }

    //     if ($request->has('title_image')) {
    //         $file = $request->file('title_image');
    //         $fileName = $file->getClientOriginalName();
    //         $file->move(public_path('images'), $fileName);
    //     }
    //     $request->merge(['title_image' => $fileName]);
    // }
}
