FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY src ./src
COPY tsconfig.json .
RUN npm run build

COPY db/init.sql /docker-entrypoint-initdb.d/init.sql

ENV NODE_ENV=production
ENV PORT=4004
EXPOSE 4004

CMD ["npm", "start"]