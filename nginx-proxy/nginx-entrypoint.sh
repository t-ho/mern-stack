#!/usr/bin/env bash
set -eu

export NGINX_PROXY_PORT=${NGINX_PROXY_PORT:-80}
export PORT=${PORT:-3000}
export SERVER_PORT=${SERVER_PORT:-8861}

if [ $NODE_ENV = production ]; then
  if [ ! -f /etc/letsencrypt/ssl_dhparam.pem ]; then
    openssl dhparam -out /etc/letsencrypt/ssl_dhparam.pem 2048
  fi

  export DOMAIN_LIST=$(echo "$DOMAIN_NAMES" | tr "," " ")
  export PRIMARY_DOMAIN=$(echo "$DOMAIN_NAMES" | cut -d "," -f 1)
  export PUBLIC_IP_ADDRESS=${PUBLIC_IP_ADDRESS:-127.0.0.1}

  envsubst '${DOMAIN_LIST} ${NGINX_PROXY_PORT} ${PORT} ${PRIMARY_DOMAIN} ${PUBLIC_IP_ADDRESS} ${SERVER_PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf
  envsubst '${PRIMARY_DOMAIN}' < /nginx.certificate_files.conf.template > /etc/nginx/h5bp/ssl/certificate_files.conf

else
  envsubst '${NGINX_PROXY_PORT} ${PORT} ${SERVER_PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf
fi

exec "$@"
