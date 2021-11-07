FROM node:16-buster
ARG API_ORIGIN
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

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
RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts

RUN ( \
  pnpm install --frozen-lockfile --prod=false --ignore-scripts \
  && node node_modules/esbuild/install.js \
  && pnpm run generate \
  && pnpm --filter=@violet/web run _:build \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts --filter=violet --filter=@violet/web \
  && find . -type f \
    | grep -v -E '^\./package.json' \
    | grep -v -E '^\./node_modules/' \
    | grep -v -E '^\./pkg/web/package.json' \
    | grep -v -E '^\./pkg/web/.babelrc' \
    | grep -v -E '^\./pkg/web/next.config.js' \
    | grep -v -E '^\./pkg/web/src/' \
    | grep -v -E '^\./pkg/web/.next/' \
    | grep -v -E '^\./pkg/web/node_modules/' \
    | grep -v -E '^\./pkg/api/package.json' \
    | grep -v -E '^\./pkg/api/prisma/' \
    | grep -v -E '^\./pkg/api/src/' \
    | grep -v -E '^\./pkg/api/types/' \
    | grep -v -E '^\./pkg/api/node_modules/' \
    | xargs rm -f \
  && rm -rf "$HOME/.pnpm-store" \
)

EXPOSE 80

ENTRYPOINT []
CMD ["pnpm", "--dir=./pkg/web", "exec", "next", "start"]
