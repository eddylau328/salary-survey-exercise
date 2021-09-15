FROM node:16-alpine as base

WORKDIR /usr/src/app

COPY package.json .

COPY yarn.lock .

RUN yarn

EXPOSE 8000

FROM base as production

WORKDIR /usr/src/app

COPY . . 

EXPOSE 8000
