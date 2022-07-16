<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatusEnum;
use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use App\Models\Session;
use App\Services\Product\CreateProductAction;
use App\Supports\Responder;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    private $createProductAction;

    public function __construct(CreateProductAction $createProductAction)
    {
        $this->createProductAction = $createProductAction;
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
        $request->validated();
        $product = $this->createProductAction->handle($request);
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

    public function auctionProducts($id)
    {
        $auctionProducts = Session::join('products', 'sessions.product_id', '=', 'products.id')
        ->join('auctions', 'sessions.auction_id', '=', 'auctions.id')
        ->where([
            ['sessions.auction_id', '=', $id],
            // ['products.status', '=', ProductStatusEnum::Accepted]
        ])
            ->get();

        // $auctionProducts = Session::with('auction', 'product')
        // ->where([
        //     ['auctions.id', '=', $id],
        //     ['products.status', '=', ProductStatusEnum::Accepted]
        // ])
        // ->get();

        return Responder::success($auctionProducts, 'get auction products success');
    }
}
