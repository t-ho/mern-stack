module.exports = {
  jwt: {
    algorithm: 'HS512',
    secret: '[Your-Secret-Token]' // FIXME:
  },
  mongo: {
    uri: 'mongodb://localhost/mern' // FIXME:
  },
  server: {
    port: process.env.PORT || 8080,
    url: 'http://localhost'
  }
};
