<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Services\Product\AssetFilesHandle;
use App\Supports\Responder;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Asset::query()->orderByDesc('id')->get();
        return Responder::success($products, 'get assets success');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id của ảnh phải là 1 số');
        }
        if (!Asset::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Ảnh số ' . $id . ' không tồn tại');
        }
        $asset = Asset::where('id', $id)->first();
        return Responder::success($asset, 'Lấy ảnh thành công');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id của ảnh phải là 1 số');
        }
        if (!Asset::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Ảnh số ' . $id . ' không tồn tại');
        }
        $deleteAsset = Asset::where('id', $id)->delete();
        return Responder::success($deleteAsset, 'Xóa thành công');
    }
}
