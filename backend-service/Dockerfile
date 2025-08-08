# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Your app binds to port 3001, so expose that
EXPOSE 3001

# Define the command to run your app
CMD [ "node", "index.js" ]