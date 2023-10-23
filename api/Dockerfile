FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /config && mv config.yaml /config/config.yaml
RUN npm run build
CMD ["node", "dist/index.js", "prod"]
