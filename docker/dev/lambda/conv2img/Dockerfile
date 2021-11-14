FROM public.ecr.aws/lambda/nodejs:14
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras enable libreoffice
RUN yum install -y libreoffice
RUN yum install -y libreoffice-langpack-ja
RUN yum install -y ImageMagick
RUN yum install -y libwebp-tools
RUN yum clean all

ENV NODE_ENV development

CMD ["pkg/lambda/conv2img/bin/index.handler"]
