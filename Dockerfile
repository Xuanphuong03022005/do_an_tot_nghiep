FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    curl git zip unzip mysql-client \
    libpng-dev libjpeg-turbo-dev freetype-dev oniguruma-dev

RUN docker-php-ext-install \
    pdo pdo_mysql mbstring exif pcntl bcmath

WORKDIR /app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

CMD ["php-fpm"]
