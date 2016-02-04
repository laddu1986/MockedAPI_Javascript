'use strict';

const Server = require('./server');

module.exports = {
  api: null,
  _instances: {},

  setup: function(config) {
    const server = new Server(config);

    if (config.name) {
      this._instances[config.name] = server;
    } else {
      this._instances['_no_name'] = server;
      this.api = server;
    }

    return server;
  },

  getByName: function(name) {
    return this._instances[name];
  },
};
