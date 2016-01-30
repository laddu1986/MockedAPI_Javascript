const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const mockedServer = require('../src')(config);
const baseUrl = 'http://localhost:3000';

describe('custom status', () => {
  before((done) => {
    mockedServer.start(done);
  });

  after(() => {
    mockedServer.stop();
  });

  beforeEach(() => {
    mockedServer.reset();
  });

  it('returns json with custom status', (done) => {
    mockedServer
      .respondTo('/42.json')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      done();
    });
  });

  it('returns json with custom status and title', (done) => {
    mockedServer
      .respondTo('/42.json')
      .andReplace('/title', 'changed title')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      expect(JSON.parse(body.toString()).title).to.equal('changed title');
      done();
    });
  });
});
