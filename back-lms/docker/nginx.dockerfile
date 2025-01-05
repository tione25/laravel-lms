# Use the official Nginx image
FROM nginx:latest

# Copy Nginx configuration files
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Ensure the snippets directory exists inside the container
RUN mkdir -p /etc/nginx/snippets

# Copy the fastcgi-php.conf snippet into the correct directory
COPY ./nginx/snippets/fastcgi-php.conf /etc/nginx/snippets/
