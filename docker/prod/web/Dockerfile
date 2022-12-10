FROM node:16-buster
ARG API_ORIGIN
ARG API_BASE_PATH
ARG NEXT_PUBLIC_AUTH_SHOW_EMAIL
ARG NEXT_PUBLIC_GCIP_API_KEY
ARG NEXT_PUBLIC_GCIP_AUTH_DOMAIN
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN ( \
  npm install -g pnpm@7.2.0 \
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
