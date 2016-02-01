const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('custom values', () => {
  before((done) => {
    mockedApi.start(done);
  });

  after(() => {
    mockedApi.stop();
  });

  beforeEach(() => {
    mockedApi.reset();
  });

  describe('when request succeeds', () => {
    it('triggers onResponse', (done) => {
      let receivedStatus, receivedBody;

      mockedApi
        .onResponse((status, body) => {
          receivedStatus = status;
          receivedBody = body;
        });

      fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
        expect(receivedStatus).to.equal(200);
        expect(receivedBody.title).to.equal('Mock 42');
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('triggers onResponse', (done) => {
      let receivedStatus, receivedBody;

      mockedApi
        .onResponse((status, body) => {
          receivedStatus = status;
          receivedBody = body;
        });

      fetchUrl(`${baseUrl}/666.json`, (err, meta, body) => {
        expect(receivedStatus).to.equal(404);
        expect(receivedBody.code).to.equal('ENOENT');
        done();
      });
    });
  });
});
