FROM node:20.14.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
EXPOSE 3000
RUN npm run setup
CMD ["node", "server/index.js"]
