var FS = require('fs');
var Path = require('path');

var express = require('express');
var jsonPointer = require('json-pointer');

var app = express();
var server; // set by listen()

var jsonMutations = [];
var statusMutations = [];
var respondToPath = null;

function fileExists(filePath) {
  return new Promise((resolve, reject) => {
    FS.stat(filePath, (err, stats) => {
      err ?
        reject([404, err]) :
        resolve();
    });
  });
}

function loadJson(filePath) {
  return new Promise((resolve, reject) => {
    FS.readFile(filePath, 'utf8', function(err, data) {
      err ?
        rejct([500, err]) :
        resolve(data);
    });
  });
}

function mutateJson(req, json) {
  var mutated = JSON.parse(json);
  jsonMutations.forEach((mutation) => {
    if (req.path == mutation.path) {
      jsonPointer.set(mutated, mutation.pointer, mutation.value);
    }
  });
  return mutated;
}

function getMutatedStatus(req) {
  const mutationForThisPath = statusMutations.filter(m => m.path == req.path);
  if (mutationForThisPath.length > 0) {
    return mutationForThisPath[0].status;
  }
  return 200;
}

module.exports = {
  init: function(config, callback) {
    app.get('*', (req, res) => {
      const filePath = Path.resolve(config.dir + req.path);
      fileExists(filePath)
        .then(() => loadJson(filePath))
        .then((json) => mutateJson(req, json))
        .then((mutatedJson) => {
          const status = getMutatedStatus(req);
          res.status(status).send(mutatedJson);
        })
        .catch((err) => {
          res.status(err[0]).send(err[1])
        });
    });

    server = app.listen(config.port, () => {
      callback();
    });
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

  reset: function() {
    jsonMutations = [];
    statusMutations = [];
    respondToPath = null;
  }
};
