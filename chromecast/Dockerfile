FROM ic3y808/docker-lemp
ADD index.html /usr/share/nginx/html/index.html
ADD splash.png /usr/share/nginx/html/splash.png
ADD logo.png /usr/share/nginx/html/logo.png
ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf
HEALTHCHECK CMD curl -s -f https://unity.d3bug.space -o /dev/null || exit 1
CMD ["/usr/bin/supervisord"] 