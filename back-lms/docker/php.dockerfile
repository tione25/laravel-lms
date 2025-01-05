FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html/

# Ensure correct permissions
RUN chown -R www-data:www-data /var/www/html

# Create vendor directory with correct permissions
RUN mkdir -p /var/www/html/vendor && chown -R www-data:www-data /var/www/html/vendor

# Install dependencies for the operating system software
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    zip \
    vim \
    git \
    curl

# Install extensions for php
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd

# Install composer (php package manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy existing application directory contents to the working directory
COPY ../ /var/www/html

# no need for the script files to be copied to docker
RUN rm -f dc
RUN rm -f php
RUN rm -f composer

# Expose port 9000 and start php-fpm server (for FastCGI Process Manager)
EXPOSE 9000
CMD ["php-fpm"]
