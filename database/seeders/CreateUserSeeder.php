<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CreateUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $user = User::create([
        'full_name' => 'user',
        'email' => 'user.auctions@gmail.com',
        'password' => 'User@123123',
        'address' => 'Hanoi',
        'phone' => '0857694721'
      ]);
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $user = User::create([
        'full_name' => 'user',
        'email' => 'user.auctions@gmail.com',
        'password' => 'User@123123',
        'address' => 'Hanoi',
        'phone' => '0857694721'
      ]);

    $user->assignRole('user');
    }
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'full_name' => 'user',
            'email' => 'user.auctions@gmail.com',
            'password' => 'User@123123',
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $user1 = User::create([
            'full_name' => 'user1',
            'email' => 'user1.auctions@gmail.com',
            'password' => 'User1@123123',
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $admin = User::create([
            'full_name' => 'admin',
            'email' => 'admin.auctions@gmail.com',
            'password' => 'Admin@123123',
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $user->assignRole('user');
        $user1->assignRole('user');
        $admin->assignRole('admin');
    }
}
