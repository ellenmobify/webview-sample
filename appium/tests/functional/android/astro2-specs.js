/*global describe, it, before, after, afterEach */
'use strict';

var apps = require('../helpers/apps')
  , tests = require('../common/astro-tests')
  , utils = require('../helpers/utils');


describe("Astro Android", function () {
  before(utils.before({
    app: apps.sampleApp,
  	appPackage: 'com.mobify.astro.scaffold',
  	appActivity: '.MainActivity',
    browserName: ''
  }));

  beforeEach(utils.beforeEach);

  afterEach(utils.afterEach);

  after(utils.after);

  it('should add a product to cart', tests.webViewTest);
  
});
