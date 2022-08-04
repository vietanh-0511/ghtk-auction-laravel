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
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
//         \App\Models\User::factory(2)->create();
=======
>>>>>>> Stashed changes
        // \App\Models\User::factory(10)->create();
        \App\Models\Product::factory(100)->create();
        \App\Models\User::factory(100)->create();

<<<<<<< Updated upstream
=======
>>>>>>> 9ded1004480fe81c9c0c7bbe91b10c8b2352c93a
>>>>>>> Stashed changes
        $this->call([
            RoleTableSeeder::class,
            PermissionTableSeeder::class,
            RoleHasPermissionsTableSeeder::class,
            CreateUserSeeder::class
        ]);
    }
}
