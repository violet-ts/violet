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
  && pnpm --dir=./packages/web run _:build \
  && pnpm install --frozen-lockfile --prod \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    packages/web/src/ \
    packages/web/.babelrc \
    packages/web/jest.config.ts \
    packages/web/next-env.d.ts \
    packages/web/stylelint.config.js \
    packages/api/scripts/ \
    packages/api/test/ \
    packages/api/aspida.config.js \
    .eslintignore \
    .eslintrc.js \
    .gitignore \
    jest.config.js \
    CODEOWNERS \
    docker-compose.yml \
    pnpm-workspace.yaml \
    pnpm-lock.yaml \
    README.md \
    tsconfig.json \
  && pnpm store prune \
)

EXPOSE 80

ENTRYPOINT ["pnpm", "--dir=./packages/web", "exec", "next", "start"]
