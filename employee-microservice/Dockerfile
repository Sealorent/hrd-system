# Use an official Node runtime as the parent image for building
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Use a smaller Node image for the final stage
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy compiled files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["node", "dist/index.js"]  # Adjust the entry point if your main file is different
