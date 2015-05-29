'use strict';

var setup = require('./setup');

module.exports.before = function (extraCaps) {
  return function (done) {
    console.log('called BEFORE')
    var desired = setup.getDesiredCapabilities(extraCaps);
    this.allPassed = true;
    this.driver = setup.getDriver(desired, done);
  };
};

module.exports.beforeEach = function () {
  console.log('called BEFOREEACH')
  return function(done) {
    console.log('called BEFOREEACH done')
    this.driver.launchApp(function(app) {
      return done();
    });
  }
};

// after each test, re-evaluate whether the whole thing passed or failed
module.exports.afterEach = function (done) {
  console.log('called AFTEREACH')
  this.driver.closeApp();
  this.allPassed = this.allPassed && (this.currentTest.state === 'passed');
  done();
};

// after all the tests, quit and update Sauce (if necessary)
module.exports.after = function (done) {
  console.log('called AFTER')
  if (process.env.SAUCE === true) {
    this.driver
      .quit()
      .sauceJobStatus(this.allPassed)
      .nodeify(done);
  } else {
    this.driver
      .quit()
      .nodeify(done);
  }
};