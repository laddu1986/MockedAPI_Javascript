const fetch = require('node-fetch');
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

    it('has default headers', (done) => {
      fetch(`${baseUrl}/42.json`).then(res => {
        expect(res.headers.get('vary')).to.equal('Origin');
        expect(res.headers.get('access-control-allow-credentials')).to.equal('true');
      }).then(done, done);
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
      fetch(`${baseUrl}/42.json`).then(res => {
        expect(res.headers.get('access-control-allow-origin')).to.equal('foo');
      }).then(done, done);
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
      fetch(`${baseUrl}/42.json`).then(res => {
        expect(res.headers.get('access-control-allow-origin')).not.to.exist;
      }).then(done, done);
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
      fetch(`${baseUrl}/42.json`, { method: 'OPTIONS' }).then(res => {
        expect(res.headers.get('access-control-allow-headers')).to.equal('Content-Type');
      }).then(done, done);
    });

    it('GET request has a Access-Control-Allow-Headers header', (done) => {
      fetch(`${baseUrl}/42.json`, { method: 'GET' }).then(res => {
        // The spec states that this should not be, but jsdom works differently..
        expect(res.headers.get('access-control-allow-headers')).to.equal('Content-Type');
      }).then(done, done);
    });
  });
});
