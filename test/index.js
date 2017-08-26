'use strict';

const Cp = require('child_process');
const Os = require('os');
const Path = require('path');
const Code = require('code');
const Fse = require('fs-extra');
const Lab = require('lab');
const StandIn = require('stand-in');
const L = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

const fixturesDir = Path.join(__dirname, 'fixtures');


function maybeMock (options) {
  if (process.env.MOCK === '1') {
    StandIn.replace(Fse, 'copy', (stand, src, dest, opts, callback) => {
      expect(src).to.equal(options.pkg);
      expect(dest).to.equal(Path.join(options.out, 'package.json'));
      expect(opts).to.equal({ clobber: true });
      callback();
    }, { stopAfter: 1 });

    StandIn.replace(Cp, 'exec', (stand, cmd, callback) => {
      const version = options.version || 'nodejs4.3';

      expect(cmd).to.equal(`docker run -v "${options.out}":/var/task lambci/lambda:build-${version} npm install --production`);
      callback();
    }, { stopAfter: 1 });
  }
}

describe('Lambstaller', () => {
  it('runs npm install in a lambda container', (done) => {
    const options = {
      out: Path.join(Os.tmpdir(), 'lambstaller_tests'),
      pkg: Path.join(fixturesDir, 'package.json')
    };

    maybeMock(options);
    L(options, (err) => {
      expect(err).to.not.exist();
      done();
    });
  });

  it('changes version of Node.js', (done) => {
    const options = {
      out: Path.join(Os.tmpdir(), 'lambstaller_tests'),
      pkg: Path.join(fixturesDir, 'package.json'),
      version: 'nodejs6.10'
    };

    maybeMock(options);
    L(options, (err) => {
      expect(err).to.not.exist();
      done();
    });
  });
});
