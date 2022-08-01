<?php

namespace App\Http\Controllers;

use App\Exceptions\CreateProductException;
use App\Exceptions\UpdateProductException;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Services\Product\CreateProductAction;
use App\Services\Product\UpdateProductAction;
use App\Supports\Responder;
use Exception;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    private $createProductAction;
    private $updateProductAction;

    public function __construct(
        CreateProductAction $createProductAction,
        UpdateProductAction $updateProductAction
    )
    {
        $this->createProductAction = $createProductAction;
        $this->updateProductAction = $updateProductAction;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $products = Product::paginate($limit);
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
        $product = '';
        try {
            $product = $this->createProductAction->handle($request);
        } catch (Exception $e) {
            return Responder::fail($product, $e->getMessage());
        }
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
        if (!Product::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the product with the id ' . $id . ' does not exist.');
        }
        $product = Product::query()
        ->join('assets', 'products.id', '=', 'assets.assetable')
        ->where('products.id', $id)
        ->get();
        return Responder::success($product, 'get product success');
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
    public function update(UpdateProductRequest $request, $id)
    {
        $product = '';
        try {
            $product = $this->updateProductAction->handle($request, $id);
        } catch (Exception $e) {
            return Responder::fail($product, $e->getMessage());
        }
        return Responder::success($product, 'update success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!Product::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'the product with the id ' . $id . ' does not exist.');
        }
        $deleteProduct = Product::where('id', $id)->delete();
        return Responder::success($deleteProduct, 'delete success');
    }

    
}
