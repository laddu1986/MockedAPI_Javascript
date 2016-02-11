const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

delete require.cache[require.resolve('../src')];
const MockedApi = require('../src');

const config = { port:6000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:6000';

let server;

describe('setup unnamed', () => {
  after(() => {
    if (server) {
      server.stop();
    }
  });

  it('starts server', (done) => {
    server = MockedApi.setup(config);

    expect(server.port).to.equal(config.port);
    expect(server.dir).to.equal(config.dir);
    expect(server.server).not.to.exist;

    server
      .start()
      .then(() => {
        expect(server.server).to.exist;

        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 42');
            resolve();
          });
        });
      })
      .then(done, done);
  });

  it('returns cached server', (done) => {
    server = MockedApi.api;

    expect(server.port).to.equal(config.port);
    expect(server.dir).to.equal(config.dir);
    expect(server.server).to.exist;

    server
      .start()
      .then(() => {
        return new Promise((resolve, reject) => {
          fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
            expect(meta.status).to.equal(200);
            expect(JSON.parse(body.toString()).title).to.equal('Mock 42');
            resolve();
          });
        });
      })
      .then(done, done);
  });
});
