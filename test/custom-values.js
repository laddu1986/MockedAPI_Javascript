const fetch = require('node-fetch');
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('custom values', () => {
  before((done) => {
    mockedApi.start().then(done, done);
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

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(200);
      return res.json();
    }).then(json => {
      expect(json.title).to.equal('changed title');
    }).then(done, done);
  });

  it('returns json with custom list', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/list', [42]);

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(200);
      return res.json();
    }).then(json => {
      expect(json.list).to.eql([42]);
    }).then(done, done);
  });

  it('returns json with custom list item', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/list/2', 42);

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(200);
      return res.json();
    }).then(json => {
      expect(json.list).to.eql([1, 2, 42]);
    }).then(done, done);
  });
});
