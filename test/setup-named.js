const fetchUrl = require('fetch').fetchUrl;
const expect = require('chai').expect;

delete require.cache[require.resolve('../src')];
const MockedApi = require('../src');

const configA = { name:'a', port:6000, dir:`${__dirname}/mocks` };
const configB = { name:'b', port:6001, dir:`${__dirname}/mocks-b` };

const baseUrlA = 'http://localhost:6000';
const baseUrlB = 'http://localhost:6001';

let serverA;
let serverB;

describe('setup named', () => {
  after(() => {
    if (serverA) {
      serverA.stop();
    }
    if (serverB) {
      serverB.stop();
    }
  });

  it('starts server A', (done) => {
    serverA = MockedApi.setup(configA);

    expect(serverA.name).to.equal(configA.name);
    expect(serverA.port).to.equal(configA.port);
    expect(serverA.dir).to.equal(configA.dir);
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
    serverB = MockedApi.setup(configB);

    expect(serverB.name).to.equal(configB.name);
    expect(serverB.port).to.equal(configB.port);
    expect(serverB.dir).to.equal(configB.dir);
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

  it('returns cached server A', (done) => {
    serverA = MockedApi.apiByName.a;

    expect(serverA.name).to.equal(configA.name);
    expect(serverA.port).to.equal(configA.port);
    expect(serverA.dir).to.equal(configA.dir);
    expect(serverA.server).to.exist;

    serverA.start(() => {
      fetchUrl(`${baseUrlA}/42.json`, (err, meta, body) => {
        expect(meta.status).to.equal(200);
        expect(JSON.parse(body.toString()).title).to.equal('Mock 42');
        done();
      });
    });
  });

  it('returns cached server B', (done) => {
    serverB = MockedApi.apiByName.b;

    expect(serverB.name).to.equal(configB.name);
    expect(serverB.port).to.equal(configB.port);
    expect(serverB.dir).to.equal(configB.dir);
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
