# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Set environment variable for the DB and JWT secrets
ENV JWT_ACCESS_SECRET = "Parthib"
ENV JWT_REFRESH_SECRET = "Sarkar"
ENV DATABASE_URL = "postgres://postgres:1234@db:5432/New1.0"

# Start Hapi.js server
CMD ["npm", "run", "start"]
