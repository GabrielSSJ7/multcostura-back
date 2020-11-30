FROM node:10

WORKDIR /usr/app

RUN npm install -g @babel/node
RUN npm install -g babel-core
RUN npm install -g @babel/core
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]