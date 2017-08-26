'use strict';

const Assert = require('assert');
const Cp = require('child_process');
const Path = require('path');
const Fse = require('fs-extra');
const Insync = require('insync');
const defaultVersion = 'nodejs4.3';


function lambstall (options, callback) {
  Assert.strictEqual(typeof options.out, 'string');
  Assert.strictEqual(typeof options.pkg, 'string');

  function setup (next) {
    next(null, options);
  }

  Insync.waterfall([
    setup,
    copy,
    install
  ], function waterfallCb (err, options) {
    callback(err);
  });
}

module.exports = lambstall;
module.exports.lambstall = lambstall;


function copy (options, next) {
  const destPkg = Path.join(options.out, 'package.json');

  Fse.copy(options.pkg, destPkg, { clobber: true }, function copyCb (err) {
    next(err, options);
  });
}


function install (options, next) {
  const version = typeof options.version === 'string' ? options.version :
                                                        defaultVersion;
  const cmd = `docker run -v "${options.out}":/var/task lambci/lambda:build-${version} npm install --production`;

  Cp.exec(cmd, function execCb (err, stdout, stderr) {
    next(err, options);
  });
}
