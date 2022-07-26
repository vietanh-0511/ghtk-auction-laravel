<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = array('Orbital Keys', 'XPress Bottle', 'InstaPress', 'Uno Wear', 'Allure Kit', 'Swish Wallet',
                        'Onovo Supply', 'Sharpy Knife', 'Towlee', 'Rhino Case', 'Mono', 'Handy Mop',
                        'ONEset', 'Vortex Bottle', 'Terra Shsave', 'Gym Kit', 'Villafy', 'Stickem',
                        'Snap It', 'Scruncho'
                );
        $price = array(100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 2000, 3000);
        $description = array('This product has a good rating',
                            'Great choice',
                            'Best sellers',
                            'The right choice',
                            'This product is highly rated by experts'
                        );
        return [
            'name' => $name[array_rand($name)],
            'desirable_price' => $price[array_rand($price)],
            'title_image' => 'titleimage',
            'description' => $description[array_rand($description)],
        ];
    }
}
