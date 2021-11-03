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
  && pnpm --dir=./pkg/web run _:build \
  && pnpm install --frozen-lockfile --prod \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    pkg/def/ \
    pkg/lambda/ \
    pkg/web/src/ \
    pkg/web/.babelrc \
    pkg/web/jest.config.ts \
    pkg/web/next-env.d.ts \
    pkg/web/stylelint.config.js \
    pkg/api/scripts/ \
    pkg/api/test/ \
    pkg/api/aspida.config.js \
    .eslintignore \
    .dockerignore \
    .stylelintignore \
    .gitignore \
    .eslintrc.js \
    CODEOWNERS \
    docker-compose.yml \
    pnpm-workspace.yaml \
    pnpm-lock.yaml \
    README.md \
    tsconfig.json \
  && pnpm store prune \
)

EXPOSE 80

ENTRYPOINT []
CMD ["pnpm", "--dir=./pkg/web", "exec", "next", "start"]
