const fetch = require('node-fetch');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3000';
const config = { port:3000, dir:`${__dirname}/mocks` };

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('state', () => {
  before((done) => {
    mockedApi.start().then(done, done);
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

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(666);
      return res.json();
    }).then(json => {
      expect(json.title).to.equal('Changed title');
      mockedApi.reset();
    }).then(() => {
      return fetch(`${baseUrl}/42.json`).then(res => {
        expect(res.status).to.equal(200);
        return res.json();
      });
    }).then(json => {
      expect(json.title).to.equal('Mock 42');
    }).then(done, done);
  });

  it('returns json for set URL only', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/title', 'Changed title')
      .withStatus(666);

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(666);
      return res.json();
    }).then(json => {
      expect(json.title).to.equal('Changed title');
    }).then(() => {
      return fetch(`${baseUrl}/deeply/nested/42.json`).then(res => {
        expect(res.status).to.equal(200);
        return res.json();
      });
    }).then(json => {
      expect(json.title).to.equal('Nested mock');
    }).then(done, done);
  });
});
