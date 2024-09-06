#Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
RUN ls -al /app/dist
EXPOSE 8000
CMD ["node","dist/server.js"]