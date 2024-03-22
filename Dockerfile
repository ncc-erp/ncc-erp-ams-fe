FROM node:16.15.1-alpine AS base

RUN mkdir opt/web
WORKDIR /opt/web

COPY ./package.json ./
COPY ./package-lock.json ./
COPY yarn.lock yarn.lock
RUN yarn

ENV PATH="./node_modules/.bin:$PATH"

COPY . .

RUN npm run build

FROM nginx:1.25.4-alpine

COPY ./nginx/default.conf /etc/nginx/conf.d/

COPY --from=base /opt/web/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]