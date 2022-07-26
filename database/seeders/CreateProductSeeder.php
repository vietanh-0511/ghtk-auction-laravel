<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class CreateProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $product = Product::create([
            'name' => 'product1',
            'desirable_price' => '100',
            'title_image' => 'titleimage',
            'description' => 'descriptionforproduct',
        ]);
    }
}
