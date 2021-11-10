FROM public.ecr.aws/lambda/nodejs:14
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN npm install -g pnpm@6.20.1

WORKDIR /app

COPY . .

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

CMD ["pkg/api/bin/lambda.handler"]
