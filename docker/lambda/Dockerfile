FROM public.ecr.aws/lambda/nodejs:14

RUN yum install -y amazon-linux-extras

RUN amazon-linux-extras enable libreoffice

RUN yum install libreoffice libreoffice-langpack-ja -y

RUN yum install ImageMagick libwebp-tools -y

RUN npm install -g yarn

COPY package.json yarn.lock ${LAMBDA_TASK_ROOT}

RUN yarn install

COPY envValues.ts index.ts s3.ts tsconfig.json ${LAMBDA_TASK_ROOT}

RUN yarn build

CMD [ "index.handler" ]
