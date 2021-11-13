FROM node:14-buster
ARG API_ORIGIN
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN ( \
  npm install -g pnpm@6.20.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV PORT 80
ENV NEXT_TELEMETRY_DISABLED 1
ENV API_BASE_PATH ""
ENV NODE_ENV production
RUN ( \
  pnpm install --frozen-lockfile --prod=false --ignore-scripts \
  && node node_modules/esbuild/install.js \
  && pnpm run generate \
  && pnpm --filter=@violet/web run _:build \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts --filter=violet --filter=@violet/web \
  && rm -rf "$HOME/.pnpm-store" \
)

EXPOSE 80

ENTRYPOINT []
CMD ["pnpm", "--dir=./pkg/web", "exec", "next", "start"]
