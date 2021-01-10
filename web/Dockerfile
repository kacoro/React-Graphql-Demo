FROM node:14 AS BUILD_IMAGE

# Create app directory
WORKDIR /app

COPY . /app

EXPOSE 8080

# Install app dependencies
COPY package.json ./


RUN yarn


COPY . .
COPY .env.local .env


ENV NODE_ENV production

RUN yarn build


FROM node:14-alpine
WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/.env ./.env
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/package.json  ./package.json

EXPOSE 3000
CMD [ "yarn", "start" ]
USER node