FROM node:10-slim

ADD ./ /app

RUN npm install -g yarn
WORKDIR /app
RUN yarn install --ignore-engines

RUN apt-get -qq update \
    && apt-get -qq install -y g++ cmake \
    && apt-get clean

RUN g++ -o random random.cpp

ENTRYPOINT ["yarn", "start"]

# for debug
# ENTRYPOINT ["yarn", "loop"]

# docker build -t pyapp:latest .
# docker build -t <image-name> <dockerfile-path-directory>
