# Use an official Node.js runtime as a parent image
FROM node:23.4.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --no-cache && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Create a non-root user and switch to it
RUN adduser -D tediyang && chown -R tediyang /usr/src/app
USER tediyang

# Expose the application port
EXPOSE 1245

# Define the command to run your app
CMD ["node", "app.js"]
