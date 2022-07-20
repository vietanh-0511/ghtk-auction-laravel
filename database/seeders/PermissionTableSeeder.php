<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Permission::create(['name' => 'Update Full Name']);
        Permission::create(['name' => 'Change Password']);
        Permission::create(['name' => 'Update Address']);
        Permission::create(['name' => 'Update Phone Number']);
        Permission::create(['name' => 'Add Product']);
        Permission::create(['name' => 'Update Product Name When Preview']);
        Permission::create(['name' => 'Update Product Desirable Price When Preview']);
        Permission::create(['name' => 'Update Product Title Image When Preview']);
        Permission::create(['name' => 'Update Product Description When Preview']);
        Permission::create(['name' => 'Update Product Images When Preview']);

        // Permission::create(['name' => 'Admin Login']);
        Permission::create(['name' => 'Update Product Status']);
        Permission::create(['name' => 'Add Product Start Price']);
        Permission::create(['name' => 'Add Product Min Step Price']);
        Permission::create(['name' => 'Add Product Highest Price']);
        Permission::create(['name' => 'Add Auction']);
        Permission::create(['name' => 'Add Product To Auction']);
    }
}
