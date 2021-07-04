const http = require('http');
const chalk = require('chalk');
const config = require('./config');
const listEndpoints = require('express-list-endpoints');

// Load mongoose and models
require('./core/mongoose');

// Load express
const app = require('./core/express');

// Server Setup
const server = http.createServer(app);
server.listen(config.server.port);

const displayAllEndpoints = () => {
  const endpoints = listEndpoints(app);
  let total = 0;
  console.log(chalk.cyanBright(`\n[*] API Endpoints:`));
  endpoints.forEach(({ path, methods, middleware }) => {
    methods.forEach((method) => {
      total += 1;
      console.log(chalk.gray(`[+] ${method.padEnd(6)}`), chalk.green(path));
    });
  });
  console.log(chalk.cyanBright(`[*] Total: ${total} endpoints`));
};

const displayConfigurationStatus = () => {
  console.log(chalk.cyanBright(`\n--:[ ${config.app.title} ]:--`));
  console.log(chalk.green(`[*] Environment: ${config.env}`));
  console.log(
    chalk.gray(`[*] Auth - Apple sign-in: ${config.auth.appleSignIn}`)
  );
  console.log(
    chalk.gray(`[*] Auth - Email verification: ${config.auth.verifyEmail}`)
  );
  console.log(
    chalk.gray(`[*] Auth - Facebook sign-in: ${config.auth.facebookSignIn}`)
  );
  console.log(
    chalk.gray(`[*] Auth - Google sign-in: ${config.auth.googleSignIn}`)
  );
  console.log(
    chalk.gray(`[*] Auth - Password reset: ${config.auth.resetPassword}`)
  );
  console.log(chalk.gray(`[*] Compression: ${config.compression.enabled}`));
  console.log(chalk.gray(`[*] Cors: ${config.cors.enabled}`));
  console.log(chalk.gray(`[*] Helmet: ${config.helmet.enabled}`));
  console.log(chalk.gray(`[*] Morgan: ${config.morgan.enabled}`));
  console.log(chalk.gray(`[*] RateLimit: ${config.rateLimit.enabled}`));
  console.log(chalk.gray(`[*] TrustProxy: ${config.trustProxy.enabled}`));
};

displayConfigurationStatus();
displayAllEndpoints();
console.log(
  chalk.green(`\n[*] API server is listening on port ${config.server.port}\n`)
);

global.app = app;
