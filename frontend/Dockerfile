# Build stage
FROM node:20-slim as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Build the production app
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy the built files from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add nginx config for SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
