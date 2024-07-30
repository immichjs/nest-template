FROM node:20-alpine

WORKDIR /app

COPY . .
COPY ./.env.production ./.env	

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
