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
            return Responder::fail($id, 'the asset id must be a number');
        }
        if (!Asset::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the asset with the id ' . $id . ' does not exist.');
        }
        $asset = Asset::where('id', $id)->first();
        return Responder::success($asset, 'get asset success');
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
            return Responder::fail($id, 'the asset id must be a number');
        }
        if (!Asset::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the asset with the id ' . $id . ' does not exist.');
        }
        $deleteAsset = Asset::where('id', $id)->delete();
        return Responder::success($deleteAsset, 'delete success');
    }
}
