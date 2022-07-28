<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
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
        $limit = $request->limit;
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
        $product = '';
        try {
            $product = Product::query()
                ->join('assets', 'products.id', '=', 'assets.assetable')
                ->where('products.id', $id)
                ->get();
        } catch (Exception $e) {
            return Responder::fail($product, $e->getMessage());
        }
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
    public function update(StoreProductRequest $request, $id)
    {
        try {
            $product = $this->updateProductAction->handle($request->toArray(), $id);
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
            throw new Exception('the session with the id ' . $id . ' does not exist.');
        }
        $product = Product::where('id', $id)->delete();
        return Responder::success($product, 'delete success');
    }

    
}
