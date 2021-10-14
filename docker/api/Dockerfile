FROM node:16-buster

WORKDIR /app

COPY ./server/package.json /app
COPY ./server/yarn.lock /app

RUN ( \
  yarn install --frozen-lockfile \
  && yarn cache clean \
)

COPY ./server /app

RUN ( \
  yarn exec prisma generate \
  && yarn exec frourio \
  && yarn exec webpack --production=production \
  && rm -rf ./node_modules \
  && yarn install --frozen-lockfile --production \
  && yarn cache clean \
)

ENTRYPOINT ["yarn", "exec", "pm2-runtime", "/app/index.js"]
