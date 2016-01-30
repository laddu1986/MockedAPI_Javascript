const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

const mockedApi = require('../src');

const configA = { port:6000, dir:`${__dirname}/mocks` };
const configB = { port:6001, dir:`${__dirname}/mocks-b` };

const baseUrlA = 'http://localhost:6000';
const baseUrlB = 'http://localhost:6001';

let serverA;
let serverB;

describe('named', () => {
  after(() => {
    serverA.stop();
    serverB.stop();
  });

  it('starts server A', (done) => {
    serverA = mockedApi('a', configA);

    expect(serverA.config).to.eql(configA);
    expect(serverA.server).not.to.exist;

    serverA.start(() => {
      expect(serverA.server).to.exist;

      fetchUrl(`${baseUrlA}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 42');

        done();
      });
    });
  });

  it('starts server B', (done) => {
    serverB = mockedApi('b', configB);

    expect(serverB.config).to.eql(configB);
    expect(serverB.server).not.to.exist;

    serverB.start(() => {
      expect(serverB.server).to.exist;

      fetchUrl(`${baseUrlB}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 43');

        done();
      });
    });
  });

  it('it returns cached server A', (done) => {
    serverA = mockedApi('a', configA);

    expect(serverA.config).to.eql(configA);
    expect(serverA.server).to.exist;

    serverA.start(() => {
      fetchUrl(`${baseUrlA}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 42');

        done();
      });
    });
  });

  it('it returns cached server B', (done) => {
    serverB = mockedApi('b', configB);

    expect(serverB.config).to.eql(configB);
    expect(serverB.server).to.exist;

    serverB.start(() => {
      fetchUrl(`${baseUrlB}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 43');

        done();
      });
    });
  });
});
