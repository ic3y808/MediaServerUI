FROM ic3y808/docker-lemp:latest
COPY index.html /usr/share/nginx/html/index.html
COPY splash.png /usr/share/nginx/html/splash.png
COPY logo.png /usr/share/nginx/html/logo.png
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
HEALTHCHECK CMD curl -s -f https://unity.d3bug.space -o /dev/null || exit 1
CMD ["/usr/bin/supervisord"] 