FROM node:14-alpine3.14

WORKDIR /app

COPY package.json package-lock.json /app/

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN npm install node-gyp -g &&\
    npm install && \
    rm -rf /temp/* /var/temp/*


# COPY ./docker-utils/entrypoint/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY . /app

RUN npm run build

EXPOSE 3003

USER node

# ENV TYPEORM_MIGRATION=DISABLE
# ENV NPM_INSTALL=DISABLE

# CMD npm run start:prod

CMD npm start
