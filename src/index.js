'use strict';

require('babel-register');

const Server = require('./server');
let server;

module.exports = function(config) {
  if (server) {
    return server;
  }

  server = new Server(config);
  return server;
};
