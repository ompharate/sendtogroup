# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This helps with Docker caching and speeds up the build process
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript to JavaScript
RUN tsc

# Expose port 4000
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/app.js"]