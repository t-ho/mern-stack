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
console.log(chalk.greenBright(`[+] Environment: ${config.env}`));
console.log(chalk.greenBright(`[+] Database URI: ${config.mongo.uri}`));
console.log(
  chalk.greenBright(`[+] Email verification: ${config.auth.verifyEmail}`)
);
console.log(
  chalk.greenBright(`[+] Password reset: ${config.auth.resetPassword}`)
);
console.log(
  chalk.greenBright(
    `[+] API server is listening on port ${config.server.port}\n`
  )
);

global.app = app;
