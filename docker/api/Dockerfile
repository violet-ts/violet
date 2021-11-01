FROM node:16-buster

RUN ( \
  npm install -g pnpm@6.19.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY . /app

ENV NODE_ENV=production

RUN --mount=type=cache,target=/root/.pnpm-store ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run build \
  && rm -rf ./**/node_modules \
  && pnpm --dir=./packages/api install --frozen-lockfile --prod \
  && pnpm store prune \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    packages/frontend/ \
    packages/api/api/ \
    packages/api/prisma/ \
    packages/api/src/ \
    packages/api/test/ \
    packages/api/\$server.ts \
    packages/api/package.json \
    packages/api/tsconfig.json \
    packages/api/webpack.config.js \
    .eslintignore \
    .eslintrc.js \
    .gitignore \
    CODEOWNERS \
    docker-compose.yml \
    package.json \
    pnpm-workspace.yaml \
    README.md \
    tsconfig.json \
)

ENV SERVER_PORT=80
EXPOSE 80

ENTRYPOINT ["node", "/app/index.js"]
