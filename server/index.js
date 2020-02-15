const http = require('http');
const chalk = require('chalk');
const config = require('./config');

// Load mongoose and models
require('./config/mongoose');

// Load express
const app = require('./config/express');

// Server Setup
const server = http.createServer(app);
server.listen(config.server.port);
console.log(chalk.blueBright(`\n--:[ ${config.app.title} ]:--`));
console.log(chalk.blueBright(`[*] Environment: ${config.env}`));
console.log(chalk.blueBright(`[*] Database: ${config.mongo.uri}`));
console.log(
  chalk.blueBright(`[*] Server is listening on port ${config.server.port}\n`)
);

global.app = app;
