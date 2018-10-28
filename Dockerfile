FROM node:8
WORKDIR /home/node/app
ADD package.json /home/node/app/package.json
RUN npm install
ADD webpack.config.js /home/node/app/webpack.config.js
ADD backend /home/node/app/backend
ADD frontend /home/node/app/frontend
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]