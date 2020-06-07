#!/usr/bin/env bash
set -eu

export PORT=${PORT:-3000}
export SERVER_PORT=${SERVER_PORT:-8861}
export NGINX_PROXY_PORT=${NGINX_PROXY_PORT:-80}

envsubst '${PORT} ${SERVER_PORT} ${NGINX_PROXY_PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
