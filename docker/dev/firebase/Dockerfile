FROM node:14-buster

RUN apt-get update -y
RUN ( \
  apt-get install -y --no-install-recommends \
    curl \
    openjdk-11-jre-headless \
)
RUN npm install -g firebase-tools
COPY . /opt/workspace/
