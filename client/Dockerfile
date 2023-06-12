FROM node:latest AS build

RUN mkdir /app

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

# Install project dependencies
RUN npm install

# Copy the entire project directory to the container
COPY . .

# Build the npm project
RUN npm run build

# Stage 2: Create a minimal Nginx image to serve the artifacts
FROM nginx:latest

# Copy the built artifacts from the previous stage to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
