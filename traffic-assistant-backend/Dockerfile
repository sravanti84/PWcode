# Use official stable Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package descriptors 
COPY package*.json ./

# Install dependencies (ignoring dev dependencies for prod, though we only have prod ones)
RUN npm install --omit=dev

# Copy all source code
COPY . .

# Expose port (Cloud run defaults to 8080 usually, but we can set via env)
EXPOSE 5000

# Start server
CMD ["npm", "start"]
