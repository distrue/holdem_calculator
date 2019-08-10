FROM node:10-slim

ENV LANG C.UTF-8

ADD ./ /app

RUN npm install -g yarn

WORKDIR /app
RUN yarn install --ignore-engines
ENTRYPOINT ["yarn", "start"]
# EXPOSE 3000  # for debug
# docker build -t <image-name> <dockerfile-path-directory>
# docker run  -p <out_port>:3200 <image-name>
