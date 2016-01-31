const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src');

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
    server = mockedApi.setup(config);

    expect(server.config).to.eql(config);
    expect(server.server).not.to.exist;

    server.start(() => {
      expect(server.server).to.exist;

      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 42');

        done();
      });
    });
  });

  it('returns cached server', (done) => {
    server = mockedApi.get();

    expect(server.config).to.eql(config);
    expect(server.server).to.exist;

    server.start(() => {
      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 42');

        done();
      });
    });
  });
});
