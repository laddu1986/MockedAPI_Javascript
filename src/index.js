'use strict';

const Server = require('./server');

module.exports = {
  api: null,
  apiByName: {},

  setup: function(config) {
    const server = new Server(config);

    if (config.name) {
      this.apiByName[config.name] = server;
    } else {
      this.apiByName['_no_name'] = server;
      this.api = server;
    }

    return server;
  },
};
