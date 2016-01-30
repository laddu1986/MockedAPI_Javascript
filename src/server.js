'use strict';

const express = require('express');
const Path = require('path');

const utils = require('./utils');

const app = express();
let server; // set in init

let jsonMutations = [];
let statusMutations = [];
let respondToPath = null;

module.exports = {
  init: function(config, callback) {
    app.get('*', (req, res) => {
      const filePath = Path.resolve(config.dir + req.path);

      utils.fileExists(filePath)
        .then(() => {
          return utils.loadJson(filePath);
        })
        .then(json => {
          return utils.mutateJson(req, json, jsonMutations);
        })
        .then(mutatedJson => {
          res
            .status(utils.getMutatedStatus(req, statusMutations))
            .send(mutatedJson);
        })
        .catch(err => {
          res
            .status(err[0])
            .send(err[1]);
        });
    });

    server = app.listen(config.port, () => {
      callback();
    });
  },

  reset: function() {
    jsonMutations = [];
    statusMutations = [];
    respondToPath = null;
  },

  stop: function() {
    if (server) {
      server.close();
    }
  },

  respondTo: function(path) {
    respondToPath = path;
    return this;
  },

  andReplace: function(pointer, value) {
    jsonMutations.push({ path:respondToPath, pointer:pointer, value:value });
    return this;
  },

  withStatus: function(status) {
    statusMutations.push({ path:respondToPath, status:666 });
    return this;
  },
};
