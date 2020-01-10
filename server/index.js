const http = require('http');
const config = require('./config');
const app = require('./config/express');

// Server Setup
const server = http.createServer(app);
server.listen(config.server.port);
console.log(`[+] Server listening on port ${config.server.port}`);
