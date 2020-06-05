FROM node:lts-buster
WORKDIR /mern-stack/server
COPY ./server/package*.json ./
RUN npm install
COPY ./.env ../.env
CMD ["npm", "run", "start"]