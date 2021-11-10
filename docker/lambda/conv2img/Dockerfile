FROM public.ecr.aws/lambda/nodejs:14
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN ( \
  yum install -y amazon-linux-extras-2.0.1-1.amzn2.noarch \
  && amazon-linux-extras enable libreoffice \
  && yum install -y \
    1:libreoffice-5.3.6.1-21.amzn2.0.3.x86_64 \
    1:libreoffice-langpack-ja-5.3.6.1-21.amzn2.0.3.x86_64 \
    ImageMagick-6.9.10.68-5.amzn2.0.1.x86_64 \
    libwebp-tools-0.3.0-10.amzn2.x86_64 \
  && yum clean all \
  && npm install -g pnpm@6.20.1 \
)

# hadolint ignore=DL3045
COPY . .

ENV NODE_ENV production

RUN ( \
  pnpm install --frozen-lockfile --prod=false --ignore-scripts \
  && node node_modules/esbuild/install.js \
  && pnpm run generate \
  && pnpm --filter=@violet/lambda-conv2img run _:build \
  && pnpm install --frozen-lockfile --prod --offline --ignore-scripts \
  && pnpm install --frozen-lockfile --prod --offline --ignore-script --filter=violet --filter=@violet/lambda-conv2img \
  && rm -rf "$HOME/.pnpm-store" \
)

CMD ["pkg/lambda/conv2img/bin/index.handler"]
