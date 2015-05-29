'use strict';
var asserters = require('wd').asserters;

var astroSelectors = {
  //native
  cartIcon: "//android.widget.ImageButton[3]",
  cartDrawer: "//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.support.v4.widget.DrawerLayout[1]/android.widget.FrameLayout[1]/android.widget.FrameLayout[1]/android.view.View[1]/android.view.View[1]",

  //web
  productList: '.c-product-list',
  addToBag: '.c-product-list .c-product:nth-child(1) button',
  checkout: '.c-checkout__action button'
}

module.exports.webViewTest = function (done) {

  // decide what kind of webview to wait for
  var webviewClassName = 'UIAWebView';
  if (process.env.DEVICE && process.env.DEVICE.toLowerCase() === 'android') {
    webviewClassName = 'android.webkit.WebView';
  }

  this.driver
    .setImplicitWaitTimeout(10000)
    .waitForElementByClassName(webviewClassName)
      .then(function () {
        console.log('in astroTest')
      })

    // Switch to WebView
    .contexts()
      .then(function (ctxs) {
        console.log(ctxs);
      })
    .context('WEBVIEW_com.mobify.astro.scaffold')
      .then(function() {
        console.log('changed context to webview');
      })

    // These steps are against WebView

    // productList element is always found
    .waitForElementByCss(astroSelectors.productList)
      .then(function(){
        console.log('found product list');
      })

    // Other elements cannot be found
    .waitForElementByCss('.c-product:nth-child(1) button', asserters.isDisplayed, 10000, 500)
      .then(function() {
        console.log('found add to cart button for first product');
      })
    .waitForElementByCss('a.c-product__link', asserters.isDisplayed, 10000, 500)
      .then(function(){
        console.log('found some other thing');
      })
    .waitForElementByCss(astroSelectors.addToBag, asserters.isDisplayed, 10000, 500)
      .then(function(addToBag) {
        console.log('found add to bag button');
        addToBag.click();
      })
    .elementByCss(astroSelectors.checkout)
      .then(function (checkout) {
        expect(checkout).to.exist;
      })
    .sleep(2000) 
    // .closeApp()
    .nodeify(done);
};

// Interacts with native components using xpath 
module.exports.cartTest = function (done) {
  this.driver
    .setImplicitWaitTimeout(10000)

    // Extra step to make sure cart is not visible at first
    .elementByXPathOrNull(astroSelectors.cartDrawer)
      .then(function(cartDrawer) {
        expect(cartDrawer).to.not.exist;
      })

    // Click on cart icon
    .waitForElementByXPath(astroSelectors.cartIcon, asserters.isDisplayed)
      .then(function(cart) {
        cart.click();
      })

    // Cart drawer should be visible
    .waitForElementByXPath(astroSelectors.cartDrawer, asserters.isDisplayed)
      .then(function(cartDrawer) {
        expect(cartDrawer).to.exist;
      })
    .sleep(2000) 
    // .closeApp()
    .nodeify(done);
};