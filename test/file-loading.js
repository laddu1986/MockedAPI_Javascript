const fetch = require('node-fetch');
const expect = require('chai').expect;

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = 'http://localhost:3000';

delete require.cache[require.resolve('../src')];
const mockedApi = require('../src').setup(config);

describe('file loading', () => {
  before((done) => {
    mockedApi.start().then(done, done);
  });

  after(() => {
    mockedApi.stop();
  });

  beforeEach(() => {
    mockedApi.reset();
  });

  describe('when file exists', () => {
    it('returns json from file directly in mock-dir', (done) => {
      fetch(`${baseUrl}/42.json`).then(res => {
        expect(res.status).to.equal(200);
        return res.json();
      }).then(json => {
        expect(json.title).to.equal('Mock 42');
        expect(json.list).to.eql([1, 2, 3]);
      }).then(done, done);
    });

    it('returns json from file nested in mock-dir', (done) => {
      fetch(`${baseUrl}/deeply/nested/42.json`).then(res => {
        expect(res.status).to.equal(200);
        return res.json();
      }).then(json => {
        expect(json.title).to.equal('Nested mock');
        expect(json.list).to.eql([10, 20, 30]);
      }).then(done, done);
    });

    describe('when extension is not given', () => {
      it('returns json from file', (done) => {
        fetch(`${baseUrl}/extensions/42`).then(res => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then(json => {
          expect(json.title).to.equal('Mock 42');
          expect(json.list).to.eql([1, 2, 3]);
        }).then(done, done);
      });

      it('returns json from file within a directory of the same name', (done) => {
        fetch(`${baseUrl}/extensions/42/43`).then(res => {
          expect(res.status).to.equal(200);
          return res.json();
        }).then(json => {
          expect(json.title).to.equal('Mock 43');
          expect(json.list).to.eql([4, 5, 6]);
        }).then(done, done);
      });
    });
  });

  describe('when file does not exist', () => {
    it('returns 404', (done) => {
      fetch(`${baseUrl}/does-not-exist.json`).then(res => {
        expect(res.status).to.equal(404);
      }).then(done, done);
    });
  });
});
