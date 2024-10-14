# Use an official Node.js Alpine-based image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies and necessary build tools
RUN apk add --no-cache libc6-compat python3 make g++ && \
    npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8009

# Command to run the Next.js app in production mode
CMD ["npm", "start"]