FROM node:16-buster

RUN ( \
  npm install -g pnpm@^6.19.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run generate \
  && pnpm --dir=./packages/api run _:build \
  && pnpm install --frozen-lockfile --prod \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    packages/frontend/ \
    packages/api/api/ \
    packages/api/prisma/ \
    packages/api/src/ \
    packages/api/scripts/ \
    packages/api/test/ \
    packages/api/\$server.ts \
    packages/api/aspida.config.js \
    packages/api/package.json \
    packages/api/tsconfig.json \
    .eslintignore \
    .eslintrc.js \
    jest.config.js \
    .gitignore \
    CODEOWNERS \
    docker-compose.yml \
    package.json \
    pnpm-workspace.yaml \
    pnpm-lock.yaml \
    README.md \
    tsconfig.json \
  && pnpm store prune \
)

ENV SERVER_PORT 80
EXPOSE 80

ENTRYPOINT ["node", "/app/packages/api/build/index.js"]
