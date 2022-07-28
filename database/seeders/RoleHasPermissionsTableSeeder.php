<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleHasPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //user:update-product - name permission
        Role::findByName('admin')->givePermissionTo(Permission::all());
        $permissions[] = Permission::findByName('Update Full Name');
        $permissions[] = Permission::findByName('Change Password');
        $permissions[] = Permission::findByName('Update Address');
        $permissions[] = Permission::findByName('Update Phone Number');
        $permissions[] = Permission::findByName('Add Product');
        $permissions[] = Permission::findByName('Update Product Name When Preview');
        $permissions[] = Permission::findByName('Update Product Desirable Price When Preview');
        $permissions[] = Permission::findByName('Update Product Title Image When Preview');
        $permissions[] = Permission::findByName('Update Product Description When Preview');
        $permissions[] = Permission::findByName('Update Product Images When Preview');
        Role::findByName('user')->givePermissionTo($permissions);
    }
}
