FROM node:16-buster

RUN ( \
  npm install -g pnpm@6.19.1 \
  && npm uninstall -g yarn \
)

WORKDIR /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install --frozen-lockfile

COPY . /app

ENV NODE_ENV=production

RUN ( \
  pnpm build \
  && rm -rf ./**/node_modules \
  && pnpm --dir=./packages/frontend install --frozen-lockfile --prod \
  && pnpm store prune \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    packages/frontend/src/ \
    packages/frontend/.babelrc \
    packages/frontend/aspida.config.js \
    packages/frontend/jest.config.ts \
    packages/frontend/next-env.d.ts \
    packages/frontend/package.json \
    packages/frontend/stylelint.config.js \
    packages/api/ \
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

ENTRYPOINT ["pnpm", "--dir=./packages/frontend", "exec", "next", "start"]
