# Use the official Node.js image as a parent image
FROM node:20

# Set the working directory in the container (absolute path recommended)
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Nest CLI globally to allow `nest build` to work
RUN npm install -g @nestjs/cli

# Install dependencies
RUN npm install --only=production

# Copy the rest of your application code to the container
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "./dist/main.js"]
