FROM nginx

MAINTAINER "Nginx Dockerfile"

ADD ./default.conf /etc/nginx/conf.d/default.conf

ADD ./admin/ /usr/share/nginx/vue-project

