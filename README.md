# GHTK Auction

## Cài đặt

Laravel 8, PHP 7.4

Database: ghtk_auction

chỉnh file .env 

Install npm
```bash
npm install
```

Install composer
```bash
composer install
 ```
 
 Tạo key mới
 ```bash
 php artisan key:generate
```
Run cron
```bash
./vendor/bin/sail php artisan schedule:work
```
