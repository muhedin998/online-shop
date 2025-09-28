# Simple dev Dockerfile for Angular app on port 4201
# Builds dependencies, copies sources, and runs the Angular dev server.

FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Angular dev server port
EXPOSE 4201

# Run Angular dev server on 0.0.0.0:4201
CMD ["node", "./node_modules/@angular/cli/bin/ng.js", "serve", "--host", "0.0.0.0", "--port", "4201"]

