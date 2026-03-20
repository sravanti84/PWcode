# Stage 1: Build the React Application
FROM node:18-alpine AS builder

# Change to /app directory
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source code and build it
COPY . .
RUN npm run build

# Stage 2: Serve the static files with NGINX
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose NGINX default port
EXPOSE 80

# Run nginx indefinitely
CMD ["nginx", "-g", "daemon off;"]
