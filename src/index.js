'use strict';

require('babel-register');

const Server = require('./server');
const instances = [];

module.exports = function(a, b) {
  const name = b ? a : null;
  const config = b ? b : a;

  const cached = instances.filter(i => i.name == name);
  if (cached.length > 0) {
    return cached[0].server;
  }

  const newInstance = { name:name, server:new Server(config) };
  instances.push(newInstance);
  return newInstance.server;
};
