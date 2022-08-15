<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Asset;
use App\Models\Product;
use App\Models\Session;
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
    ) {
        $this->createProductAction = $createProductAction;
        $this->updateProductAction = $updateProductAction;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // $limit = $request->input('limit', 10);
        // if ($limit <= 0 || !is_int($limit)) {
        //     return Responder::fail($limit, 'limit invalid');
        // }
        $search = $request->query('search') ?? '';
        $products = Product::query()->where('name', 'like', "%$search%")->orderByDesc('id')->get();
        foreach ($products as $product) {
            $product['asset'] = Asset::query()->where('assetable', '=', $product->id)->first();
        }
        return Responder::success($products, 'get products success');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreProductRequest $request)
    {
        $product = '';
        try {
            $product = $this->createProductAction->handle($request);
        } catch (Exception $e) {
            return Responder::fail($product, $e->getMessage());
        }
        return Responder::success($product, 'Thêm thành công');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!Product::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Sản phẩm không tồn tại');
        }
        $product = Product::query()
            ->where('id', $id)
            ->first();
        $assets = Asset::query()->where('assetable', $id)->get();
        return Responder::success([$product, 'assets' => $assets], 'Lấy thành công');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateProductRequest $request, $id)
    {
        $product = '';
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!Product::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Sản phẩm không tồn tại');
        }
        try {
            $product = $this->updateProductAction->handle($request, $id);
        } catch (Exception $e) {
            return Responder::fail($product, $e->getMessage());
        }
        return Responder::success($product, 'Sửa thành công');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (preg_match('/[^0-9]/', $id)) {
            return Responder::fail($id, 'id phải là 1 số');
        }
        if (!Product::query()->where('id', $id)->exists()) {
            return Responder::fail($id, 'Sản phẩm không tồn tại');
        }
        Asset::where('assetable', $id)->delete();
        Session::where('product_id', $id)->delete();
        $deleteProduct = Product::where('id', $id)->delete();
        return Responder::success($deleteProduct, 'Xóa thành công');
    }

    public function showProductsNotInSession()
    {
        $productInSessions = Session::get('product_id')->toArray();
        $products = Product::query()->whereNotIn('id', $productInSessions)->get();
        foreach ($products as $product) {
            $product['asset'] = Asset::query()->where('assetable', '=', $product->id)->first();
        }
        return Responder::success($products, 'Lấy thành công');
    }
}
