const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3000';
const config = { port:3000, dir:`${__dirname}/mocks` };

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('state', () => {
  before((done) => {
    mockedApi.start(done);
  });

  after(() => {
    mockedApi.stop();
  });

  beforeEach(() => {
    mockedApi.reset();
  });

  it('resets to original behaviour', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/title', 'Changed title')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      expect(JSON.parse(body.toString()).title).to.equal('Changed title');

      mockedApi.reset();

      fetchUrl(`${baseUrl}/42.json`, (err2, meta2, body2) => {
        expect(meta2.status).to.equal(200);
        expect(JSON.parse(body2.toString()).title).to.equal('Mock 42');
        done();
      });
    });
  });

  it('returns json for set URL only', (done) => {
    mockedApi
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
