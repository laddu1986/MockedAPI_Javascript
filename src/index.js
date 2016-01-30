'use strict';

require('babel-register');

const Server = require('./server');

module.exports = function(config) {
  return new Server(config);
};
