const http = require('http');
const config = require('./config');

// Load mongoose and models
require('./config/mongoose');

// Load express
const app = require('./config/express');

// Server Setup
const server = http.createServer(app);
server.listen(config.server.port);
console.log(`[+] Server is listening on port ${config.server.port}`);

global.app = app;
