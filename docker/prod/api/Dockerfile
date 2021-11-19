FROM node:14-buster
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN ( \
  npm install -g pnpm@6.20.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV API_PORT 80
ENV NODE_ENV production

RUN ( \
  pnpm install --frozen-lockfile --prod=false --ignore-scripts \
  && node node_modules/esbuild/install.js \
  && pnpm run generate \
  && pnpm --filter=@violet/api run _:build \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts --filter=violet --filter=@violet/api \
  && rm -rf "$HOME/.pnpm-store" \
)

WORKDIR /app/pkg/api
EXPOSE 80

ENTRYPOINT []
CMD ["node", "./build/index.js"]
