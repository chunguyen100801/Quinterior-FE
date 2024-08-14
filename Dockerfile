FROM node:20 AS base

FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["yarn","run","start"]
