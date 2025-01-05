# Stage 1: Build Stage
FROM node:18 as build-stage

# Set working directory inside the container
WORKDIR /app

COPY . ./app

# Remove the 'node' script manually after copying everything
RUN rm -f /app/node

# Expose the port used by Vite
EXPOSE 5173