FROM node:8-alpine
WORKDIR /home/node/app
RUN mkdir /home/node/app/data && chown node /home/node/app/data
RUN npm install -g webpack webpack-cli
ADD ./webpack.config.js /home/node/app/webpack.config.js
ADD ./package.json /home/node/app/package.json
ADD ./backend /home/node/app/backend
ADD ./frontend/ /home/node/app/frontend
RUN npm install
RUN npm run build
EXPOSE 3000
VOLUME [ "/home/node/app/data/" ]
CMD [ "npm", "start" ]