FROM node:11.9
WORKDIR /home/node/app
ADD package.json /home/node/app/package.json
RUN npm install


ADD webpack.config.js /home/node/app/webpack.config.js
ADD database.json /home/node/app/database.json
ADD migrations /home/node/app/migrations
ADD backend /home/node/app/backend
ADD frontend /home/node/app/frontend
ADD api /home/node/app/api
ADD receiver /home/node/app/receiver

RUN npm run build
EXPOSE 3000 4000
CMD [ "npm", "run", "prod" ]