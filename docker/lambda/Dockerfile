FROM public.ecr.aws/lambda/nodejs:14

RUN yum install -y amazon-linux-extras

RUN amazon-linux-extras enable libreoffice

RUN yum install libreoffice libreoffice-langpack-ja ImageMagick libwebp-tools -y

RUN yum clean all

RUN npm install -g yarn@1.22.17

COPY package.json yarn.lock ${LAMBDA_TASK_ROOT}

RUN yarn install && yarn cache clean

COPY envValues.ts index.ts s3.ts tsconfig.json ${LAMBDA_TASK_ROOT}

RUN yarn build

CMD [ "index.handler" ]
