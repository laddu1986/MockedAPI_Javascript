const fetchUrl = require("fetch").fetchUrl;
const expect = require('chai').expect;

const mockedServer = require('../src/server');

const config = { port:3000, dir:`${__dirname}/mocks` };
const baseUrl = "http://localhost:3000";

describe('mockedServer', () => {
  before((done) => {
    mockedServer.init(config, done);
  });

  after(() => {
    mockedServer.stop();
  });

  beforeEach(() => {
    mockedServer.reset();
  });

  describe('GET', () => {
    describe('file loading', () => {
      it('returns json from file directly in mock-dir', (done) => {
        fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
          expect(meta.status).to.equal(200);

          const json = JSON.parse(body.toString());
          expect(json.title).to.equal('Mock 42');
          expect(json.list).to.eql([1, 2, 3]);

          done();
        });
      });

      it('returns json from file nested in mock-dir', (done) => {
        fetchUrl(`${baseUrl}/api/content/42.json`, (err, meta, body) => {
          expect(meta.status).to.equal(200);

          const json = JSON.parse(body.toString());
          expect(json.title).to.equal('Nested mock');
          expect(json.list).to.eql([10, 20, 30]);

          done();
        });
      });
    });

    describe('custom values', () => {
      it('returns json with custom title', (done) => {
        mockedServer
          .respondTo('/42.json')
          .andReplace('/title', 'changed title');

        fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
          expect(meta.status).to.equal(200);
          expect(JSON.parse(body.toString()).title).to.equal('changed title');
          done();
        });
      });

      it('returns json with custom list', (done) => {
        mockedServer
          .respondTo('/42.json')
          .andReplace('/list', [42]);

        fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
          expect(meta.status).to.equal(200);
          expect(JSON.parse(body.toString()).list).to.eql([42]);
          done();
        });
      });

      it('returns json with custom list item', (done) => {
        mockedServer
          .respondTo('/42.json')
          .andReplace('/list/2', 42);

        fetchUrl(`${baseUrl}/42.json`, (err, meta, body) => {
          expect(meta.status).to.equal(200);
          expect(JSON.parse(body.toString()).list).to.eql([1, 2, 42]);
          done();
        });
      });
    });

    describe('custom status', () => {
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

    describe('state', () => {
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

          fetchUrl(`${baseUrl}/api/content/42.json`, (err2, meta2, body2) => {
            expect(meta2.status).to.equal(200);
            expect(JSON.parse(body2.toString()).title).to.equal('Nested mock');
            done();
          });
        });
      });
    });
  });
});
