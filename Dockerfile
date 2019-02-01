FROM node:11.3.0

RUN userdel -r node
ENV PUID 1000
ENV PGID 1000

RUN groupadd -g 1000 alloy && useradd -r -u 1000 -g alloy alloy && usermod -g root alloy
RUN mkdir -p /home/alloy/app/data && chown alloy -R /home/alloy/app

WORKDIR /home/alloy/app
	
ADD package.json /home/alloy/app/package.json
RUN npm install

ADD webpack.config.js /home/alloy/app/webpack.config.js
ADD database.json /home/alloy/app/database.json
ADD migrations /home/alloy/app/migrations
ADD backend /home/alloy/app/backend
ADD frontend /home/alloy/app/frontend
ADD api /home/alloy/app/api
ADD receiver /home/alloy/app/receiver
VOLUME ["/home/alloy/app/data"]
RUN npm run build
RUN chown alloy -R /home/alloy/app
USER alloy
EXPOSE 3000 4000
CMD [ "npm", "run", "prod" ]