FROM node:14

RUN mkdir -p /usr/app && chmod -R 777 /usr/app

RUN chown -Rh $user:node /usr/app

WORKDIR /usr/app

COPY package*.json ./

#USER node

RUN npm install && npm cache clean --force --loglevel=error
RUN npm config set unsafe-perm true
COPY . .

EXPOSE 4000

CMD [ "npm", "start"]
