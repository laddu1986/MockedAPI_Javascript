const fetchUrl = require('fetch').fetchUrl; // TODO: use node-fetch because of promises
const expect = require('chai').expect;

delete require.cache[require.resolve('../src')];
const MockedApi = require('../src');

const configA = { name:'a', port:6000, dir:`${__dirname}/mocks` };
const configB = { name:'b', port:6001, dir:`${__dirname}/mocks-b` };

const baseUrlA = 'http://localhost:6000';
const baseUrlB = 'http://localhost:6001';

let serverA;
let serverB;

describe('setup named', () => {
  after(() => {
    if (serverA) {
      serverA.stop();
    }
    if (serverB) {
      serverB.stop();
    }
  });

  it('starts server A', (done) => {
    serverA = MockedApi.setup(configA);

    expect(serverA.name).to.equal(configA.name);
    expect(serverA.port).to.equal(configA.port);
    expect(serverA.dir).to.equal(configA.dir);
    expect(serverA.server).not.to.exist;

    serverA
      .start()
      .then(() => {
        expect(serverA.server).to.exist;
        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrlA}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 42');
            resolve();
          });
        });
      })
      .then(done, done);
  });

  it('starts server B', (done) => {
    serverB = MockedApi.setup(configB);

    expect(serverB.name).to.equal(configB.name);
    expect(serverB.port).to.equal(configB.port);
    expect(serverB.dir).to.equal(configB.dir);
    expect(serverB.server).not.to.exist;

    serverB
      .start()
      .then(() => {
        expect(serverB.server).to.exist;
        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrlB}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 43');
            resolve();
          });
        });
      })
      .then(done, done);
  });

  it('returns cached server A', (done) => {
    serverA = MockedApi.getByName('a');

    expect(serverA.name).to.equal(configA.name);
    expect(serverA.port).to.equal(configA.port);
    expect(serverA.dir).to.equal(configA.dir);
    expect(serverA.server).to.exist;

    serverA
      .start()
      .then(() => {
        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrlA}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 42');
            resolve();
          });
        });
      })
      .then(done, done);
  });

  it('returns cached server B', (done) => {
    serverB = MockedApi.getByName('b');

    expect(serverB.name).to.equal(configB.name);
    expect(serverB.port).to.equal(configB.port);
    expect(serverB.dir).to.equal(configB.dir);
    expect(serverB.server).to.exist;

    serverB
      .start()
      .then(() => {
        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrlB}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 43');
            resolve();
          });
        });
      })
      .then(done, done);
  });
});
