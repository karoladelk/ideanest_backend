# Use Node.js 20+ official image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./


RUN npm install

COPY . .

# Build the NestJS app (compile TypeScript to JavaScript)
RUN npm run build

EXPOSE 8080

# Start the app using the production build
CMD ["npm", "run", "start:prod"]
