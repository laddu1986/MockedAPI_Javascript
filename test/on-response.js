const fetch = require('node-fetch');
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];
const MockedApi = require('../src').setup(config);

describe('on response', () => {
  before((done) => {
    MockedApi.start().then(done, done);
  });

  after(() => {
    MockedApi.stop();
  });

  beforeEach(() => {
    MockedApi.reset();
  });

  describe('when request succeeds', () => {
    it('triggers onResponse', (done) => {
      let receivedStatus, receivedBody;

      MockedApi
        .onResponse((status, body) => {
          receivedStatus = status;
          receivedBody = body;
        });

      fetch(`${baseUrl}/42.json`).then(res => {
        expect(receivedStatus).to.equal(200);
        expect(receivedBody.title).to.equal('Mock 42');
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('triggers onResponse', (done) => {
      let receivedStatus, receivedBody;

      MockedApi
        .onResponse((status, body) => {
          receivedStatus = status;
          receivedBody = body;
        });

      fetch(`${baseUrl}/666.json`).then(res => {
        expect(receivedStatus).to.equal(404);
        expect(receivedBody.code).to.equal('ENOENT');
        done();
      });
    });
  });
});
