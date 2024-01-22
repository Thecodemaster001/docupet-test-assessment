FROM php:8.3-cli

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip \
 && rm -rf /var/lib/apt/lists/*

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=prod \
    APP_DEBUG=0

WORKDIR /app

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist

COPY . .
RUN [ -f .env ] || cp .env.example .env \
 && composer dump-autoload --no-dev --classmap-authoritative \
 && php bin/console cache:warmup

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
