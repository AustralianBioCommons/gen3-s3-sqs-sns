FROM node:18-buster

RUN apt-get update && apt-get install -y awscli

RUN npm install -g aws-cdk

WORKDIR /app

COPY . /app

RUN npm install

ENTRYPOINT ["cdk", "--require-approval", "never"]
