FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install -g @nestjs/cli
RUN npm install
COPY . .

CMD ["npm", "run", "start:dev"]

