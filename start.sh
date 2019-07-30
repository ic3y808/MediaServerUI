#!/bin/bash
COMPOSE_PATH="`dirname \"$0\"`/docker-compose.yml"
while getopts "udbh" opt
do
	case $opt in
		u)
			echo "$2";
			mkdir $2
			chmod 777 -R $2
			chown 1000:1000 -R $2
			docker volume create --name alloydata --opt type=none --opt device=$2 --opt o=bind
			docker-compose -f $COMPOSE_PATH up --force-recreate
			exit 0
		;;
		d)
			echo "down";
			docker-compose -f $COMPOSE_PATH down
			docker volume rm alloydata
		;;
		b)
			echo "build";
			docker-compose -f $COMPOSE_PATH down
			docker-compose -f $COMPOSE_PATH build
		;;
		h)
			echo "use: ./start.sh [up|down] /media/dir"; exit 1;
		;;
	esac
done 
if [ $# -eq 0 ]
then
	echo "use: ./start.sh [up|down] /media/dir"; exit 1;
fi