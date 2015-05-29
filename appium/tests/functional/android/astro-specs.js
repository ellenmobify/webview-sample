/*global describe, it, before, after, afterEach */
'use strict';

var apps = require('../helpers/apps')
  , tests = require('../common/astro-tests')
  , utils = require('../helpers/utils');


describe("Astro Android", function () {
  before(utils.before({
  	// appPackage: 'com.mobify.astro.scaffold',
    app: apps.sampleApp,
  	appActivity: '.MainActivity',
    browserName: ''
  }));

  beforeEach(utils.beforeEach);

  afterEach(utils.afterEach);

  after(utils.after);

  it('can open the cart', tests.cartTest);

  // Previous app session closes
  // Next test starts to run before app is fully launched
  // not sure why? 

  // it('should add a product to cart', tests.webViewTest);
  
});
