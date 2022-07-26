<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CreateAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::create([
            'full_name' => 'admin',
            'email' => 'admin.auctions@gmail.com',
            'password' => 'Admin@123123',
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $admin->assignRole('admin');
    }
}
