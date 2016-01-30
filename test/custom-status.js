const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const mockedApi = require('../src')(config);
const baseUrl = 'http://localhost:3000';

describe('custom status', () => {
  before((done) => {
    mockedApi.start(done);
  });

  after(() => {
    mockedApi.stop();
  });

  beforeEach(() => {
    mockedApi.reset();
  });

  it('returns json with custom status', (done) => {
    mockedApi
      .respondTo('/42.json')
      .withStatus(666);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(666);
      done();
    });
  });

  it('returns json with custom status and title', (done) => {
    mockedApi
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
