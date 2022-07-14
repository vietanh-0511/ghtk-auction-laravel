<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use App\Services\Product\ImageFileHandle;
use App\Supports\Responder;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    private $imageFileHandle;

    public function __construct(ImageFileHandle $imageFileHandle)
    {
        $this->imageFileHandle = $imageFileHandle;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::all();
        return Responder::success($products, 'get products success');
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
    public function store(StoreProductRequest $request)
    {
        $userId = $request->user('api')->id;
        $this->imageFileHandle->handle($request);
        $product = $request->all();
        $product['user_id'] = $userId;
        $product = Product::create($product);
        return Responder::success($product, 'store success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Product::findOrFail($id);
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
        $productUpdated = Product::where('id', $id)->update($request->all());
        return Responder::success($productUpdated, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Product::where('id', $id)->delete();
    }
}
