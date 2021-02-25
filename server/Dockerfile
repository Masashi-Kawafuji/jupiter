FROM node:14.15.4

RUN apt-get update -qq && apt-get install -y libvips-dev && \
  ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
