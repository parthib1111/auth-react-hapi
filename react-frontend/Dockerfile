#Step 1: Build the app
FROM node:18 AS build

WORKDIR /app

#Install dependencies
COPY package.json package-lock.json ./
RUN npm install 

# Copy the rest of the app
COPY . .

#Build the app
RUN npm run build


# Step 2: serve the app with a production-ready server
FROM nginx:alpine

# Copy the build files from the build container to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]