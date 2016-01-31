'use strict';

const Server = require('./server');
const instances = [];

function getInstance(name) {
  const cached = instances.filter(i => i.name == name);
  if (cached.length > 0) {
    return cached[0];
  }
}

module.exports = {
  setup: function(a, b) {
    const name = typeof a === 'string' ? a : null;
    const config = name && b ? b : a;

    const cached = getInstance(name);
    if (cached) {
      return cached.server;
    }

    const newInstance = { name:name, server:new Server(config) };
    instances.push(newInstance);
    return newInstance.server;
  },

  get: function(name) {
    const cached = getInstance(name);
    if (cached) {
      return cached.server;
    }
  },
};
