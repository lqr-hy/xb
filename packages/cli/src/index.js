
module.exports = core

const pkg = require('../package.json');

function core () {
  console.log("core")
  checkPackageVersion();
}

function checkPackageVersion() {
  console.log(pkg.version);
}