#!/usr/bin/env bash
set -eu

export PORT=${PORT:-3000}
export SERVER_PORT=${SERVER_PORT:-8861}
export NGINX_PROXY_PORT=${NGINX_PROXY_PORT:-80}

if [ $NODE_ENV = production ] && [ ! -f /etc/letsencrypt/ssl_dhparam.pem ]; then
  openssl dhparam -out /etc/letsencrypt/ssl_dhparam.pem 2048
fi


envsubst '${DOMAIN_NAME} ${NGINX_PROXY_PORT} ${PORT} ${SERVER_PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
