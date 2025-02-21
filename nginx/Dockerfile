# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the configuration file
COPY nginx.conf /etc/nginx/nginx.conf 

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 
