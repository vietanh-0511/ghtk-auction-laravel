# GHTK Auction

## Requirements
- PHP `^7.3 | ^8.0`
- Laravel `8.0`
- [Laravel Passport](https://laravel.com/docs/8.x/passport) `10.4`.
- [Laravel Permission](https://spatie.be/docs/laravel-permission/v5/installation-laravel) `5.5`.
- [Laravel Enum](https://github.com/BenSampo/laravel-enum) `4.2`.
- ...

### File `.env` 

DB_DATABASE=`<your_database>` (ex: `ghtk_auction`)

DB_USERNAME=`<your_username>`

DB_PASSWORD=`<your_password>`

Generate App Key

`php artisan key:generate`

### Setting

Install npm

`npm install`

Install Composer

`composer install`
 
Migrate Database with fresh and Seeder

`php artisan migrate:fresh --seed`

Create the encryption keys needed to generate secure access tokens - *Laravel Passport*.

`php artisan passport:install`
