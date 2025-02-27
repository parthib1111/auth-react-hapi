# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite's development server port
EXPOSE 5173

# Set environment variable for the API URL to backend
# Replace this with the proper backend container name
ENV VITE_API_URL="http://backend:5000"

# Start React app in development mode
CMD ["npm", "run", "dev"]
