FROM node:16-buster
ARG API_ORIGIN

RUN ( \
  npm install -g pnpm@^6.20.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV PORT 80
ENV NEXT_TELEMETRY_DISABLED 1
ENV API_BASE_PATH ""
ENV NODE_ENV production

RUN ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run generate \
  && pnpm --dir=./pkg/web run _:build \
  && pnpm install --frozen-lockfile --prod \
  && find . \
    | grep -v -w '\\.' \
    | grep -v -E '^\\./package.json' \
    | grep -v -E '^\\./node_modules/' \
    | grep -v -E '^\\./pkg/web/package.json' \
    | grep -v -E '^\\./pkg/web/.babelrc' \
    | grep -v -E '^\\./pkg/web/next.config.js' \
    | grep -v -E '^\\./pkg/web/src/' \
    | grep -v -E '^\\./pkg/web/.next/' \
    | grep -v -E '^\\./pkg/api/package.json' \
    | grep -v -E '^\\./pkg/api/prisma/' \
    | grep -v -E '^\\./pkg/api/node_modules/' \
    | xargs rm -rf \
  && pnpm store prune \
)

EXPOSE 80

ENTRYPOINT []
CMD ["pnpm", "--dir=./pkg/web", "exec", "next", "start"]
