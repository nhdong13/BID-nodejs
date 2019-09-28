FROM node:10.15.3-alpine as builder

RUN mkdir -p /root/src/app
WORKDIR /root/src/app
ENV PATH /root/src/app/node_modules/.bin:$PATH
RUN npm install -g yarn

COPY . .
RUN /bin/sh -l -c "ls -a"

RUN yarn
RUN npm run build

FROM node:10.15.3-alpine

WORKDIR /root/src/app
ENV PATH /root/src/app/node_modules/.bin:$PATH
RUN npm install -g yarn

COPY --from=builder /root/src/app/dist /root/src/app/dist
COPY --from=builder /root/src/app/package.json /root/src/app/package.json
COPY --from=builder /root/src/app/yarn.lock /root/src/app/yarn.lock
RUN npm install -g yarn
RUN yarn install --production

EXPOSE 3000

ENTRYPOINT ["node","./dist/server.js"]

# This is docker build command: 
# docker build -t nodejs-api .

# This is docker run command:
# docker run -d --name nodejs-api -p 5000:3000 nodejs-api:latest