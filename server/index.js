const http = require('http');
const chalk = require('chalk');
const config = require('./config');

// Load mongoose and models
require('./core/mongoose');

// Load express
const app = require('./core/express');

// Server Setup
const server = http.createServer(app);
server.listen(config.server.port);
console.log(chalk.cyanBright(`\n--:[ ${config.app.title} ]:--`));
console.log(chalk.green(`[*] Environment: ${config.env}`));
console.log(
  chalk.gray(`[*] Auth - Email verification: ${config.auth.verifyEmail}`)
);
console.log(
  chalk.gray(`[*] Auth - Password reset: ${config.auth.resetPassword}`)
);
console.log(chalk.gray(`[*] Compression: ${config.compression.enabled}`));
console.log(chalk.gray(`[*] Cors: ${config.cors.enabled}`));
console.log(chalk.gray(`[*] Helmet: ${config.helmet.enabled}`));
console.log(chalk.gray(`[*] Morgan: ${config.morgan.enabled}`));
console.log(
  chalk.green(`[*] API server is listening on port ${config.server.port}\n`)
);

global.app = app;
