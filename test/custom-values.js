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

  it('returns json with custom title', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/title', 'changed title');

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(200);
      expect(JSON.parse(body.toString()).title).to.equal('changed title');
      done();
    });
  });

  it('returns json with custom list', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/list', [42]);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(200);
      expect(JSON.parse(body.toString()).list).to.eql([42]);
      done();
    });
  });

  it('returns json with custom list item', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/list/2', 42);

    fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
      expect(meta.status).to.equal(200);
      expect(JSON.parse(body.toString()).list).to.eql([1, 2, 42]);
      done();
    });
  });
});
