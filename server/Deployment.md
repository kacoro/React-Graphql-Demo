

Dokku
[condeponder](cloud.digitalocean.com)

[nodejs-docker-webapp](nodejs.org/en/docs/guides/nodejs-docker-webapp)

```
touch Dockerfile
```

```
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn
RUN yarn build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/server.js" ]
USER node

```


```
docker build -t kacoro/:test
```