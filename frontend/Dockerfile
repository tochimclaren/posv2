# Use Node.js 20.18.0 as the base image
FROM node:20.18.0-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port for the React dev server
EXPOSE 5173

# Start the React development server
CMD ["npm", "run", "dev"]
