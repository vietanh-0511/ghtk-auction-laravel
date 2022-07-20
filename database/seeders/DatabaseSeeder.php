<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            RoleTableSeeder::class,
            PermissionTableSeeder::class,
            RoleHasPermissionsTableSeeder::class,
            CreateAdminSeeder::class
        ]);
    }
}
