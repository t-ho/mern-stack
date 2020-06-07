#!/usr/bin/env bash
set -eu

export PORT=${PORT:-80}

envsubst '${PORT}' < /nginx.default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
