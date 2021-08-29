FROM node:16-buster

RUN apt-get update -y

RUN apt-get install -y curl openjdk-11-jre-headless

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs

RUN npm install -g firebase-tools
