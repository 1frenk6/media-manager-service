FROM node:22.11.0-alpine

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY . .
COPY pg_data/migrations ./dist/pg_data/migrations


RUN npm run build --verbose
ENV NODE_ENV production

#CMD ["ls", "-altrh"]
CMD ["npm", "run", "start"]
