FROM php:8.0-apache

# Install dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd mysqli pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Fix permissions
RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/images/
RUN mkdir -p /var/www/html/images && chmod -R 777 /var/www/html/images/

# Configure Apache
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/docker-php.conf \
    && a2enconf docker-php

# Copy and enable our custom PHP configuration
COPY docker/php/php.conf /etc/apache2/conf-available/
RUN a2enconf php

# Ensure PHP files are processed correctly
RUN echo 'AddType application/x-httpd-php .php' >> /etc/apache2/apache2.conf
RUN echo 'DirectoryIndex index.php index.html' >> /etc/apache2/apache2.conf

# Make sure mod_php is enabled
RUN a2enmod php

EXPOSE 80

CMD ["apache2-foreground"] 