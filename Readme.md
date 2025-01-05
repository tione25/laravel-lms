How to install this app.

RUN FIRST IN ROOT: sudo chmod -R 777 .

1. In terminal, go to back-lms and run these commands:
- ./dc build
- ./dc up -d
- ./composer install
- ./php artisan migrate
- ./php artisan db:seed

2. In another terminal, go to front-lms and run these commands:
- ./dc build
- ./dc up -d
- ./node npm install
- ./node npm run dev

FRONT URL: http://localhost:8001/
BACK URL: http://localhost:8002/