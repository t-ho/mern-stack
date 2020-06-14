FROM nginx:stable
COPY ./nginx-proxy/templates/default.conf.template.dev /nginx.default.conf.template
COPY ./nginx-proxy/nginx-entrypoint.sh /
RUN chmod +x nginx-entrypoint.sh
ENTRYPOINT [ "/nginx-entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]

