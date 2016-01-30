'use strict';

const FS = require('fs');
const JsonPointer = require('json-pointer');

module.exports = {
  fileExists: function fileExists(filePath) {
    return new Promise((resolve, reject) => {
      FS.stat(filePath, (err, stats) => {
        err ?
          reject([404, err]) :
          resolve();
      });
    });
  },

  loadJson: function loadJson(filePath) {
    return new Promise((resolve, reject) => {
      FS.readFile(filePath, 'utf8', function(err, data) {
        err ?
          reject([500, err]) :
          resolve(data);
      });
    });
  },

  mutateJson: function mutateJson(req, json, mutations) {
    const mutated = JSON.parse(json);
    mutations.forEach((mutation) => {
      if (req.path == mutation.path) {
        JsonPointer.set(mutated, mutation.pointer, mutation.value);
      }
    });
    return mutated;
  },

  getMutatedStatus: function getMutatedStatus(req, mutations) {
    const mutationsForPath = mutations.filter(m => m.path == req.path);
    if (mutationsForPath.length > 0) {
      return mutationsForPath[0].status;
    }
    return 200;
  },

};
