FROM node:18-alpine AS build
WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node","dist/app.js"]
