FROM node:14.15.4

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && mkdir ~/.aws

COPY .aws/credentials  ~/.aws

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
