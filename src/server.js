import express from 'express';
import Path from 'path';
import FS from 'fs';
import JsonPointer from 'json-pointer';

module.exports = class Server {
  constructor(config) {
    this.reset();

    this.name = config.name;
    this.port = config.port;
    this.dir = config.dir;

    this.express = express();
    this.express.get('*', (req, res) => {
      this.getHandler(req, res);
    });
  }

  reset() {
    this.jsonMutations = [];
    this.statusMutations = [];
    this.respondToPath = null;
    this.responseHandler = () => {};
    return this;
  }

  start(callback) {
    if (this.server) {
      return callback();
    }
    this.server = this.express.listen(this.port, callback);
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  getHandler(req, res) {
    const filePath = Path.resolve(this.dir + req.path);

    this._fileExists(filePath)
      .then(() => {
        return this._loadJson(filePath);
      })
      .then(json => {
        return this._mutateJson(req, json);
      })
      .then(mutatedJson => {
        const status = this._getMutatedStatus(req);
        const body = mutatedJson;
        this.responseHandler(status, body);
        res.status(status).send(body);
      })
      .catch(err => {
        this.responseHandler(err[0], err[1]);
        res.status(err[0]).send(err[1]);
      });
  }

  respondTo(path) {
    this.respondToPath = path;
    return this;
  }

  andReplace(pointer, value) {
    this.jsonMutations.push({ path:this.respondToPath, pointer:pointer, value:value });
    return this;
  }

  withStatus(status) {
    this.statusMutations.push({ path:this.respondToPath, status:status });
    return this;
  }

  onResponse(fn) {
    this.responseHandler = fn;
    return this;
  }

  /*
   * Private helpers
   */

  _fileExists(filePath) {
    return new Promise((resolve, reject) => {
      FS.stat(filePath, (err, stats) => {
        err ?
          reject([404, err]) :
          resolve();
      });
    });
  }

  _loadJson(filePath) {
    return new Promise((resolve, reject) => {
      FS.readFile(filePath, 'utf8', function(err, data) {
        err ?
          reject([500, err]) :
          resolve(data);
      });
    });
  }

  _mutateJson(req, json) {
    const mutated = JSON.parse(json);
    this.jsonMutations.forEach((mutation) => {
      if (req.path == mutation.path) {
        JsonPointer.set(mutated, mutation.pointer, mutation.value);
      }
    });
    return mutated;
  }

  _getMutatedStatus(req) {
    const mutationsForPath = this.statusMutations.filter(m => m.path == req.path);
    if (mutationsForPath.length > 0) {
      return mutationsForPath[0].status;
    }
    return 200;
  }
};
