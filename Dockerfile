# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./
COPY tsconfig*.json ./

# Install production dependencies.
RUN npm install --production

# Copy the application source code to the container image.
COPY . .

# Build the application.
RUN npm run build

# Run the web service on container startup.
CMD ["npm", "run", "start:prod"]
