const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;
const MockedApi = require('../src');

const baseConfig = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];

function getMockedApiWithCors(corsConfig, done, callback) {
  const config = Object.assign({ cors: corsConfig }, baseConfig);
  return MockedApi.setup(config);
}

describe('cors config', () => {

  describe('as default', () => {
    const server = getMockedApiWithCors(null);

    before((done) => {
      server.start().then(done, done);
    });

    after(() => {
      server.stop();
    });

    it('has an Access-Control-Allow-Origin header', (done) => {
      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(meta.responseHeaders['access-control-allow-origin']).to.equal('*');
        expect(meta.responseHeaders['access-control-allow-credentials']).to.equal('true');
        done();
      });
    });
  });

  describe('with origin', () => {
    const server = getMockedApiWithCors({ origin: 'foo' });

    before((done) => {
      server.start().then(done, done);
    });

    after(() => {
      server.stop();
    });

    it('has a correct Access-Control-Allow-Origin header', (done) => {
      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(meta.responseHeaders['access-control-allow-origin']).to.equal('foo');
        done();
      });
    });
  });

  describe('with origin as regex that does not match', () => {
    const server = getMockedApiWithCors({ origin: /^you-shall-not-match$/ });

    before((done) => {
      server.start().then(done, done);
    });

    after(() => {
      server.stop();
    });

    it('has no Access-Control-Allow-Origin header', (done) => {
      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(meta.responseHeaders['access-control-allow-origin']).not.to.exist;
        done();
      });
    });
  });

  describe('with allowedHeaders', () => {
    const server = getMockedApiWithCors({ allowedHeaders: [ 'Content-Type' ] });

    before((done) => {
      server.start().then(done, done);
    });

    after(() => {
      server.stop();
    });

    it('OPTIONS request has a Access-Control-Allow-Headers header', (done) => {
      fetchUrl(`${baseUrl}/42.json`, { method: 'OPTIONS' }, (err, meta, body) => {
        expect(meta.responseHeaders['access-control-allow-headers']).to.equal('Content-Type');
        done();
      });
    });

    it('GET request should not have a Access-Control-Allow-Headers header', (done) => {
      fetchUrl(`${baseUrl}/42.json`, { method: 'GET' }, (err, meta, body) => {
        expect(meta.responseHeaders['access-control-allow-headers']).not.to.exist;
        done();
      });
    });
  });

});
