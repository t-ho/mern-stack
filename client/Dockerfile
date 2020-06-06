FROM node:lts-buster
WORKDIR /mern-stack/client
COPY ./client/package*.json ./
RUN npm install
CMD ["npm", "run", "start"]