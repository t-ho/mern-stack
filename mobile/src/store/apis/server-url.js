if (process.env.NODE_ENV === 'production') {
  module.exports = require('./server-url.prod');
} else {
  module.exports = require('./server-url.dev');
}
