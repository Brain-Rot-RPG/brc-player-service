FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY src ./src
COPY tsconfig.json .
RUN npm run build

ENV PORT=4004
EXPOSE 4004

CMD ["npm", "start"]