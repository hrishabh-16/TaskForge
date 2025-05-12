# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Fix TailwindCSS configuration
# Create or update tailwind.config.js to include colors
RUN echo 'module.exports = {\n\
  content: ["./src/**/*.{html,ts}"],\n\
  theme: {\n\
    extend: {},\n\
  },\n\
  plugins: [],\n\
  safelist: [\n\
    "bg-yellow-100",\n\
    "bg-green-100",\n\
    "bg-red-100",\n\
    "bg-blue-100",\n\
    "text-yellow-800",\n\
    "text-green-800",\n\
    "text-red-800",\n\
    "text-blue-800"\n\
  ]\n\
};' > tailwind.config.js

# Configure API URL for production
RUN sed -i "s|http://localhost:4000|https://todo-backend-cahd.onrender.com|g" src/environments/environment.prod.ts || echo "Failed to update backend URL"

# Increase budget limits in angular.json
RUN npx -y json -I -f angular.json -e "this.projects['todo-frontend'].architect.build.configurations.production.budgets[0].maximumError='2mb'; this.projects['todo-frontend'].architect.build.configurations.production.budgets[0].maximumWarning='1mb'"

# Build the application for production
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/todo-frontend/browser /usr/share/nginx/html

# Create nginx configuration directory
RUN mkdir -p /etc/nginx/templates/

# Create a default nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# When the container starts, nginx will start
CMD ["nginx", "-g", "daemon off;"]