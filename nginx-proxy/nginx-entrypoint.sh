#!/usr/bin/env bash
set -eu

envsubst '${PORT} ${SERVER_PORT} ${NGINX_PROXY_PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
