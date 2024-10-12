# Use an official Node runtime as the parent image
FROM node:14

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

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run the app when the container launches
CMD ["npm", "start"]