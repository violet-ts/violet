FROM node:16-buster

RUN ( \
  npm install -g pnpm@^6.19.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run generate \
  && pnpm --dir=./packages/frontend run _:build \
  && pnpm install --frozen-lockfile --prod \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    packages/frontend/src/ \
    packages/frontend/.babelrc \
    packages/frontend/jest.config.ts \
    packages/frontend/next-env.d.ts \
    packages/frontend/package.json \
    packages/frontend/stylelint.config.js \
    packages/api/scripts/ \
    packages/api/test/ \
    packages/api/aspida.config.js \
    .eslintignore \
    .eslintrc.js \
    .gitignore \
    jest.config.js \
    CODEOWNERS \
    docker-compose.yml \
    package.json \
    pnpm-workspace.yaml \
    pnpm-lock.yaml \
    README.md \
    tsconfig.json \
  && pnpm store prune \
)

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

ENTRYPOINT ["pnpm", "--dir=./packages/frontend", "exec", "next", "start"]
