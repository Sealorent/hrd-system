# 1. Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# 4. Install the dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js application
RUN npm run build

# 7. Expose the port the app runs on
EXPOSE 8009

# 8. Command to run the Next.js app in production mode
CMD ["npm", "start"]
