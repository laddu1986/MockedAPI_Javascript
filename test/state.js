const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const mockedServer = require('../src')(config);
const baseUrl = 'http://localhost:3000';

describe('state', () => {
  before((done) => {
    mockedServer.start(done);
  });

  after(() => {
    mockedServer.stop();
  });

  beforeEach(() => {
    mockedServer.reset();
  });

  it('resets to original behaviour', (done) => {
    mockedServer
      .respondTo('/42.json')
      .andReplace('/title', 'Changed title')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      expect(JSON.parse(body.toString()).title).to.equal('Changed title');

      mockedServer.reset();

      fetchUrl(`${baseUrl}/42.json`, (err2, meta2, body2) => {
        expect(meta2.status).to.equal(200);
        expect(JSON.parse(body2.toString()).title).to.equal('Mock 42');
        done();
      });
    });
  });

  it('returns json for set URL only', (done) => {
    mockedServer
      .respondTo('/42.json')
      .andReplace('/title', 'Changed title')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      expect(JSON.parse(body.toString()).title).to.equal('Changed title');

      fetchUrl(`${baseUrl}/deeply/nested/42.json`, (err2, meta2, body2) => {
        expect(meta2.status).to.equal(200);
        expect(JSON.parse(body2.toString()).title).to.equal('Nested mock');
        done();
      });
    });
  });
});
