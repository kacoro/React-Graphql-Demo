FROM node:14 AS BUILD_IMAGE

# Create app directory
WORKDIR /app

COPY . /app

EXPOSE 8080

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.production .env
COPY .env.example .env.example


ENV NODE_ENV production

RUN yarn build


FROM node:14-alpine
WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/.env .env
COPY --from=BUILD_IMAGE /app/.env.example .env.example
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules


EXPOSE 8080
CMD [ "node", "dist/index.js" ]
USER node