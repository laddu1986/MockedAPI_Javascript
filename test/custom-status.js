const fetch = require('node-fetch');
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('custom status', () => {
  before((done) => {
    mockedApi.start().then(done, done);
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

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(666);
    }).then(done, done);
  });

  it('returns json with custom status and title', (done) => {
    mockedApi
      .respondTo('/42.json')
      .andReplace('/title', 'changed title')
      .withStatus(666);

    fetch(`${baseUrl}/42.json`).then(res => {
      expect(res.status).to.equal(666);
      return res.json();
    }).then(json => {
      expect(json.title).to.equal('changed title');
    }).then(done, done);
  });
});
