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
  && pnpm install --frozen-lockfile --prod --filter=./pkg/lambda/conv2img \
  && find . -type f \
    | grep -v -E '^\./package.json' \
    | grep -v -E '^\./node_modules/' \
    | grep -v -E '^\./pkg/lambda/conv2img/package.json' \
    | grep -v -E '^\./pkg/lambda/conv2img/build/' \
    | grep -v -E '^\./pkg/lambda/conv2img/node_modules/' \
    | xargs rm -f \
  && rm -rf "$HOME/.pnpm-store" \
)

CMD ["pkg/lambda/conv2img/build/index.handler"]
