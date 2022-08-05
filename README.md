
# GHTK Auction


## Requirements
- PHP `^7.4 | ^8.0`
- Laravel `8.0`
- [Laravel JWT](https://jwt-auth.readthedocs.io/en/develop/laravel-installation/) `1.0.2`.
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

Generate secret key

`php artisan jwt:secret`

## Realtime update bids

Đăng ký tài khoản và tạo kênh với Pusher

Cài đặt pusher laravel
```bash
composer require pusher/pusher-php-server
```
Cài đặt 2 thư viện javascript Laravel Echo và Pusher
```bash
npm install --save laravel-echo pusher-js
```
Cấu hình .env


### Create user via command line

`php artisan users:create <email> <password> <role> [OPTION]`

```
OPTION

-F, --full_name : add user's full_name (default: 'Default Name')
-A, --address : add user's address (default: 'Default Address')
-P, --phone : add user's phone number (default: 0000000000)

ex. php artisan users:create a1@gmail.com Aa@123123 user --full_name "Mía Nguyễn" --address "Hanoi" --phone 0123456789
    same:
    php artisan users:create a1@gmail.com Aa@123123 user -F "Mía Nguyễn" -A "Hanoi" -P 0123456789
```

### Frontend

```bash
sail npm run watch
```

Tự động thay đổi khi có thay đổi file js:

http://localhost:3000/app/

Bản thường:

http://localhost:8002/app/
