FROM node:16-buster

RUN ( \
  npm install -g pnpm@^6.20.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV API_PORT 80
ENV NODE_ENV production

RUN ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run generate \
  && pnpm --dir=./pkg/api run _:build \
  && pnpm install --frozen-lockfile --prod --filter=./pkg/api \
  && find . \
    | grep -v -E '^\.$' \
    | grep -v -E '^\./package.json' \
    | grep -v -E '^\./node_modules/' \
    | grep -v -E '^\./pkg/api/package.json' \
    | grep -v -E '^\./pkg/api/build/' \
    | grep -v -E '^\./pkg/api/prisma/' \
    | grep -v -E '^\./pkg/api/node_modules/' \
    | xargs rm -rf \
  && pnpm store prune \
)

EXPOSE 80

ENTRYPOINT []
CMD ["node", "/app/pkg/api/build/index.js"]
