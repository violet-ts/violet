FROM node:16-buster

WORKDIR /app

COPY ./server/package.json /app
COPY ./server/yarn.lock /app

RUN ( \
  yarn install --frozen-lockfile --production=false \
  && yarn cache clean \
)

COPY ./server /app

RUN ( \
  yarn exec prisma generate \
  && yarn exec frourio \
  && yarn exec webpack -- --mode=production \
  && rm -rf ./node_modules \
  && yarn install --frozen-lockfile --production \
  && yarn cache clean \
  && rm -rf \
    api/ \
    prisma/ \
    service/ \
    test/ \
    types/ \
    utils/ \
    validators/ \
    \$server.ts \
    .env.example \
    index.ts \
    tsconfig.json \
    webpack.config.js \
    yarn.lock \
)

ENV SERVER_PORT=80
ENV NODE_ENV=PRODUCTION
EXPOSE 80

ENTRYPOINT ["node", "/app/index.js"]
