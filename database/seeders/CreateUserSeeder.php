<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

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
            'email_verified_at' => Carbon::now(),
            'password' => 'User@123123',
            'email_verified_at' => Carbon::now(),
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $user1 = User::create([
            'full_name' => 'user1',
            'email' => 'user1.auctions@gmail.com',
            'email_verified_at' => Carbon::now(),
            'password' => 'User1@123123',
            'email_verified_at' => Carbon::now(),
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $admin = User::create([
            'full_name' => 'admin',
            'email' => 'admin.auctions@gmail.com',
            'email_verified_at' => Carbon::now(),
            'password' => 'Admin@123123',
            'email_verified_at' => Carbon::now(),
            'address' => 'Hanoi',
            'phone' => '0857694721'
        ]);

        $user->assignRole('user');
        $user1->assignRole('user');
        $admin->assignRole('admin');
    }
}
