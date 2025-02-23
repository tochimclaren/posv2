# Use Node.js 20.18.0 as the base image
FROM node:20.18.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the backend port
EXPOSE 4000

# Start the server in development mode
CMD ["npm", "run", "dev"]
