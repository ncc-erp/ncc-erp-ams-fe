FROM node:16.15.1-alpine AS builder

RUN mkdir opt/web
WORKDIR /opt/web

COPY ./package.json ./
COPY ./package-lock.json ./
COPY yarn.lock yarn.lock
RUN yarn

ENV PATH="./node_modules/.bin:$PATH"

FROM builder

COPY . .

EXPOSE 3000

ENTRYPOINT npm run dev