FROM public.ecr.aws/lambda/nodejs:14

RUN yum install -y amazon-linux-extras

RUN amazon-linux-extras enable libreoffice

RUN yum install libreoffice libreoffice-langpack-ja ImageMagick libwebp-tools -y

RUN yum clean all

RUN npm install -g pnpm@6.20.1

COPY . .

ENV NODE_ENV production

RUN ( \
  pnpm install --frozen-lockfile --prod=false \
  && pnpm run generate \
  && pnpm --dir=./pkg/lambda/conv2img run _:build \
  && pnpm install --frozen-lockfile --prod \
  && rm -rf \
    .github/ \
    .vscode/ \
    docker/ \
    pkg/web/ \
    pkg/api/ \
    pkg/def/ \
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

CMD ["pkg/lambda/conv2img/index.handler"]
