FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    dcron \
    curl git zip unzip mysql-client \
    libpng-dev libjpeg-turbo-dev freetype-dev oniguruma-dev gd

RUN docker-php-ext-install \
    pdo pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

COPY docker/cron /etc/cron.d/app-cron
RUN chmod 0644 /etc/cron.d/app-cron \
    && crontab /etc/cron.d/app-cron

CMD ["php-fpm"]
