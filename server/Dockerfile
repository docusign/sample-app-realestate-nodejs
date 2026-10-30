FROM --platform=linux/amd64 node:22.23.4 AS base

RUN mkdir -p /home/node/app
WORKDIR /home/node
COPY .env ./
COPY private.key ./

WORKDIR /home/node/app
COPY ./server/package.json ./server/package-lock.json ./server/.npmrc ./
RUN npm ci --only=production
RUN npm cache clean --force

COPY server ./


# Run stage
FROM --platform=linux/amd64 node:22.23.4-alpine

RUN mkdir -p /home/node/app
COPY --from=base /home/node /home/node
WORKDIR /home/node/app
COPY .env ./
COPY private.key ./
EXPOSE 5000

CMD ["npm", "run", "start"]